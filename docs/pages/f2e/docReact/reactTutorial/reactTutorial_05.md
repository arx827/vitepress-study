---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第五章：筆記管理功能實作
  本章將引導您實作「個人化任務與效能追蹤系統」中的 `筆記管理功能`。我們將定義筆記的資料結構，並使用 `React Context API` 進行狀態管理，這將是學習如何管理跨組件共享狀態的絕佳機會。此外，我們還將探討如何整合富文本編輯器，以提供更豐富的筆記編輯體驗。

## 5.1 筆記資料結構設計
  與任務管理類似，我們首先需要為筆記定義清晰的資料結構，以便於 `TypeScript` 進行類型檢查和程式碼維護。

  ### 1. **定義 TypeScript 介面 (Interface) for Note**
  - 在 `src/types` 目錄下建立 `note.d.ts` 文件。

  - `src/types/note.d.ts`：
    ```ts
    export interface Note {
      id: string; // 筆記唯一識別符
      title: string; // 筆記標題
      content: string; // 筆記內容 (支援富文本 HTML 字符串)
      createdAt: string; // 建立時間
      updatedAt: string; // 更新時間
    }
    ```
    
  - `content` 屬性將用於儲存富文本編輯器生成的 `HTML` 字符串。

## 5.2 使用 React Context API 進行狀態管理
  對於筆記這樣需要在多個組件之間共享和操作的數據，`React Context API` 是一個非常合適的狀態管理方案。它允許我們在組件樹中傳遞數據，而無需手動地在每一層級傳遞 `props`。

  ### 1. **建立 `NotesContext` 與 `NotesProvider`**
  - 在 `src` 目錄下建立一個 `context` 資料夾，並在其中建立 `NotesContext.tsx` 文件。
    
  - `src/context/NotesContext.tsx`：
    ```tsx
    import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
    import { Note } from '../types/note';
    import { v4 as uuidv4 } from 'uuid';
    import axios from 'axios';

    const API_BASE_URL = 'http://localhost:3001';

    interface NotesContextType {
      notes: Note[];
      addNote: (title: string, content: string) => Promise<void>;
      updateNote: (id: string, title: string, content: string) => Promise<void>;
      deleteNote: (id: string) => Promise<void>;
      fetchNotes: () => Promise<void>;
    }

    const NotesContext = createContext<NotesContextType | undefined>(undefined);

    interface NotesProviderProps {
      children: ReactNode;
    }

    export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
      const [notes, setNotes] = useState<Note[]>([]);

      const fetchNotes = async () => {
        try {
          const response = await axios.get<Note[]>(`${API_BASE_URL}/notes`);
          setNotes(response.data);
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };

      useEffect(() => {
        fetchNotes();
      }, []);

      const addNote = async (title: string, content: string) => {
        const now = new Date().toISOString();
        const newNote: Note = {
          id: uuidv4(),
          title,
          content,
          createdAt: now,
          updatedAt: now,
        };
        try {
          const response = await axios.post<Note>(`${API_BASE_URL}/notes`, newNote);
          setNotes((prevNotes) => [...prevNotes, response.data]);
        } catch (error) {
          console.error('Error adding note:', error);
        }
      };

      const updateNote = async (id: string, title: string, content: string) => {
        const now = new Date().toISOString();
        const updatedNote = { title, content, updatedAt: now };
        try {
          await axios.patch(`${API_BASE_URL}/notes/${id}`, updatedNote);
          setNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note))
          );
        } catch (error) {
          console.error('Error updating note:', error);
        }
      };

      const deleteNote = async (id: string) => {
        try {
          await axios.delete(`${API_BASE_URL}/notes/${id}`);
          setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      };

      return (
        <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, fetchNotes }}>
          {children}
        </NotesContext.Provider>
      );
    };

    export const useNotes = () => {
      const context = useContext(NotesContext);
      if (context === undefined) {
        throw new Error('useNotes must be used within a NotesProvider');
      }
      return context;
    };
    ```
    
  - `NotesContext.tsx` 定義了一個 `NotesContext`，它包含筆記列表 (`notes`) 和操作筆記的方法 (`addNote`, `updateNote`, `deleteNote`, `fetchNotes`)。
    
  - `NotesProvider` 是一個組件，它將 `NotesContext` 的值提供給其所有子組件。它還負責從 API 獲取初始筆記數據。
    
  - `useNotes` 是一個自訂 Hook，方便我們在任何子組件中訪問 `NotesContext` 的值。

  ### 2. **將 `NotesProvider` 整合到 `App.tsx`**
  - 為了讓整個應用程式都能訪問筆記狀態，我們需要將 `NotesProvider` 包裹在 `App` 組件的頂層。
    
  - 修改 `src/App.tsx`：
    ```tsx {4,20,43}
    import { Routes, Route } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import { NotesProvider } from '@/context/NotesContext'; // 引入 NotesProvider

    // ... (引入所有頁面組件)
    import DashboardPage from '@/pages/DashboardPage';
    import TasksPage from '@/pages/TasksPage';
    import TaskDetailPage from '@/pages/TaskDetailPage';
    import NotesPage from '@/pages/NotesPage';
    import NoteDetailPage from '@/pages/NoteDetailPage';
    import SettingsPage from '@/pages/SettingsPage';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';

    function App() {
      const isAuthenticated = true; // 模擬使用者已登入

      return (
        <NotesProvider> {/* 將 NotesProvider 包裹在頂層 */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/tasks/:id" element={<TaskDetailPage />} />
                      <Route path="/notes" element={<NotesPage />} />
                      <Route path="/notes/:id" element={<NoteDetailPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </NotesProvider>
      );
    }

    export default App;
    ```

  ### 3. **筆記列表的增、刪、改、查邏輯**
  - 修改 `src/pages/NotesPage.tsx`，使用 `useNotes` Hook 來獲取和操作筆記數據：
    ```tsx
    import React, { useState } from 'react';
    import PageHeader from '@/components/PageHeader';
    import Card from '@/components/ui/Card';
    import Button from '@/components/ui/Button';
    import Modal from '@/components/ui/Modal';
    import Input from '@/components/ui/Input';
    import { useNotes } from '@/context/NotesContext';
    import { Note } from '@/types/note';
    import { Link } from 'react-router-dom';

    const NotesPage: React.FC = () => {
      const { notes, addNote, deleteNote, updateNote } = useNotes();
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentNote, setCurrentNote] = useState<Note | null>(null);
      const [noteTitle, setNoteTitle] = useState('');
      const [noteContent, setNoteContent] = useState(''); // 暫時使用普通字符串，稍後會整合富文本編輯器

      const handleAddNote = () => {
        setCurrentNote(null);
        setNoteTitle('');
        setNoteContent('');
        setIsModalOpen(true);
      };

      const handleEditNote = (note: Note) => {
        setCurrentNote(note);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setIsModalOpen(true);
      };

      const handleDeleteNote = async (id: string) => {
        if (window.confirm('確定要刪除這則筆記嗎？')) {
          await deleteNote(id);
        }
      };

      const handleSubmitNote = async () => {
        if (!noteTitle.trim()) return;

        if (currentNote) {
          await updateNote(currentNote.id, noteTitle, noteContent);
        } else {
          await addNote(noteTitle, noteContent);
        }
        setIsModalOpen(false);
      };

      return (
        <div>
          <PageHeader title="筆記" description="記錄您的想法和靈感。" />
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddNote}>新增筆記</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content.replace(/<[^>]*>?/gm, '')}</p> {/* 移除 HTML 標籤顯示摘要 */}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Link to={`/notes/${note.id}`}>
                    <Button variant="outline" size="sm">查看</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>編輯</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteNote(note.id)}>刪除</Button>
                </div>
              </Card>
            ))}
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentNote ? '編輯筆記' : '新增筆記'}>
            <div className="space-y-4">
              <Input
                id="noteTitle"
                label="筆記標題"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="輸入筆記標題"
              />
              <div>
                <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">筆記內容</label>
                <textarea
                  id="noteContent"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={8}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="輸入筆記內容"
                ></textarea>
              </div>
              <Button onClick={handleSubmitNote} className="w-full">
                {currentNote ? '更新筆記' : '建立筆記'}
              </Button>
            </div>
          </Modal>
        </div>
      );
    };

    export default NotesPage;
    ```
    
  - `NoteDetailPage.tsx` 也需要修改，以從 `NotesContext` 獲取筆記數據：
    ```tsx
    import React, { useEffect, useState } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import PageHeader from '@/components/PageHeader';
    import Card from '@/components/Card';
    import Button from '@/components/Button';
    import { useNotes } from '@/context/NotesContext';
    import type { Note } from '@/types/note';

    const NoteDetailPage: React.FC = () => {
      const { id } = useParams<{ id: string }>();
      const { notes, deleteNote } = useNotes();
      const [note, setNote] = useState<Note | undefined>(undefined);

      useEffect(() => {
        setNote(notes.find(n => n.id === id));
      }, [id, notes]);

      const handleDelete = async () => {
        if (note && window.confirm('確定要刪除這則筆記嗎？')) {
          await deleteNote(note.id);
          // 刪除後導航回筆記列表頁
          // history.push('/notes'); // 在 React Router v6 中使用 useNavigate
        }
      };

      if (!note) {
        return <p>筆記未找到。</p>;
      }

      return (
        <div>
          <PageHeader title={`筆記詳情: ${note.title}`} description="查看和編輯筆記的詳細資訊。" />
          <Card className="mb-6">
            <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
            <p className="text-gray-700 mb-2">**建立日期:** {new Date(note.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-4">**更新日期:** {new Date(note.updatedAt).toLocaleDateString()}</p>
            <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: note.content }}></div>
            <div className="flex space-x-4">
              <Link to={`/notes/${note.id}/edit`}> {/* 這裡需要一個編輯頁面路由 */}
                <Button variant="primary">編輯筆記</Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>刪除筆記</Button>
            </div>
          </Card>
          <Link to="/notes" className="text-primary hover:underline">返回筆記列表</Link>
        </div>
      );
    };

    export default NoteDetailPage;
    ```
        
  - **注意**：在 `NoteDetailPage` 中，我們使用了 `dangerouslySetInnerHTML` 來渲染 `HTML` 內容。這在顯示富文本內容時是必要的，但請務必確保內容來源是可信的，以防止 `XSS` 攻擊。

## 5.3 富文本編輯器整合 (Optional, 進階)
  為了提供更豐富的筆記編輯體驗，我們可以整合一個富文本編輯器。這裡我們以 [React Tiptap](https://tiptap.dev/docs/editor/getting-started/install/react) 為例，它是一個功能強大且易於使用的富文本編輯器。

  ### 1. **選擇並安裝 React Tiptap**
  - 安裝 `react-quill` 及其類型定義：
    ```bash
    npm install \
    @tiptap/react \
    @tiptap/starter-kit \
    @tiptap/extension-link \
    @tiptap/extension-image \
    @tiptap/extension-placeholder \
    @tiptap/extension-text-align \
    @tiptap/extension-text-style \
    @tiptap/extension-color \
    @tiptap/extension-highlight \
    @tiptap/extension-underline \
    @tiptap/extension-task-list \
    @tiptap/extension-task-item \
    @tiptap/extension-code-block-lowlight \
    @tiptap/extension-table \
    @tiptap/extension-table-row \
    @tiptap/extension-table-cell \
    @tiptap/extension-table-header \
    @tiptap/extension-youtube \
    @tiptap/pm \
    lowlight
    # 或者
    yarn add \
    @tiptap/react \
    @tiptap/starter-kit \
    @tiptap/extension-link \
    @tiptap/extension-image \
    @tiptap/extension-placeholder \
    @tiptap/extension-text-align \
    @tiptap/extension-text-style \
    @tiptap/extension-color \
    @tiptap/extension-highlight \
    @tiptap/extension-underline \
    @tiptap/extension-task-list \
    @tiptap/extension-task-item \
    @tiptap/extension-code-block-lowlight \
    @tiptap/extension-table \
    @tiptap/extension-table-row \
    @tiptap/extension-table-cell \
    @tiptap/extension-table-header \
    @tiptap/extension-youtube \
    @tiptap/pm \
    lowlight
    ```

  ### 2. **編輯器組件封裝與使用**
  - 建立一個 `src/components/NoteEditor.tsx` 組件來封裝富文本編輯器：
    ```tsx
    import { useEffect, type FC } from 'react'
    import { EditorContent, useEditor } from '@tiptap/react'
    import { FloatingMenu } from '@tiptap/react/menus'
    import StarterKit from '@tiptap/starter-kit'
    import Placeholder from '@tiptap/extension-placeholder'
    import { MenuBar } from '@/components/NoteEditorMenuBar'

    interface NoteEditorProps {
      value?: string
      onChange?: (value: string) => void
      placeholder?: string
    }

    const NoteEditor: FC<NoteEditorProps> = ({
      value = '',
      onChange,
      placeholder = '輸入筆記內容…',
    }) => {
      const editor = useEditor({
        extensions: [
          StarterKit,
          Placeholder.configure({
            placeholder,
          }),
        ],
        content: value || '<p></p>',
        immediatelyRender: true,
        editorProps: {
          attributes: {
            class: 'min-h-40 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500',
          },
        },
        onUpdate: ({ editor }) => {
          onChange?.(editor.getHTML())
        },
      })

      useEffect(() => {
        if (!editor) return

        const currentHtml = editor.getHTML()
        const nextHtml = value || '<p></p>'

        if (currentHtml !== nextHtml) {
          editor.commands.setContent(nextHtml, { emitUpdate: false })
        }
      }, [editor, value])

      return (
        <div className="space-y-2">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      )
    }

    export default NoteEditor
    ```

  - 建立 `src/components/NoteEditorMenuBarState.ts`，`MenuBar` 的設定檔：
    ```ts
    import type { Editor } from '@tiptap/core'
    import type { EditorStateSnapshot } from '@tiptap/react'

    /**
    * State selector for the MenuBar component.
    * Extracts the relevant editor state for rendering menu buttons.
    */
    export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor>) {
      return {
        // Text formatting
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,

        // Block types
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,

        // Lists and blocks
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,

        // History
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    }

    export type MenuBarState = ReturnType<typeof menuBarStateSelector>
    ```

  - 建立 `src/components/NoteEditorMenuBar.tsx`，設定 `MenuBar`，也可以改成自己喜歡的 `icon`：
    ```tsx
    import type { Editor } from '@tiptap/core'
    import { useEditorState } from '@tiptap/react'
    import React from 'react'

    import '@/assets/css/noteEditorMenuBar.css'

    import { menuBarStateSelector } from '@/components/NoteEditorMenuBarState.js'

    export const MenuBar = ({ editor }: { editor: Editor | null }) => {
      const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
      })

      if (!editor) {
        return null
      }

      return (
        <div className="control-group">
          <div className="button-group">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editorState.canBold}
              className={editorState.isBold ? 'is-active' : ''}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editorState.canItalic}
              className={editorState.isItalic ? 'is-active' : ''}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editorState.canStrike}
              className={editorState.isStrike ? 'is-active' : ''}
            >
              Strike
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editorState.canCode}
              className={editorState.isCode ? 'is-active' : ''}
            >
              Code
            </button>
            <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editorState.isParagraph ? 'is-active' : ''}
            >
              Paragraph
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editorState.isHeading1 ? 'is-active' : ''}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editorState.isHeading2 ? 'is-active' : ''}
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editorState.isHeading3 ? 'is-active' : ''}
            >
              H3
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={editorState.isHeading4 ? 'is-active' : ''}
            >
              H4
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
              className={editorState.isHeading5 ? 'is-active' : ''}
            >
              H5
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
              className={editorState.isHeading6 ? 'is-active' : ''}
            >
              H6
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editorState.isBulletList ? 'is-active' : ''}
            >
              Bullet list
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editorState.isOrderedList ? 'is-active' : ''}
            >
              Ordered list
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editorState.isCodeBlock ? 'is-active' : ''}
            >
              Code block
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editorState.isBlockquote ? 'is-active' : ''}
            >
              Blockquote
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              Horizontal rule
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
              Undo
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
              Redo
            </button>
          </div>
        </div>
      )
    }
    ```

  - 建立 `src/assets/css/noteEditorMenuBar.css`，樣式表
    ```css
    /* 編輯器 */
    .ProseMirror {
      min-height: 10rem;
      outline: none;
    }

    .ProseMirror p {
      margin: 0 0 0.75rem;
    }

    .ProseMirror p:last-child {
      margin-bottom: 0;
    }

    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #9ca3af;
      pointer-events: none;
      height: 0;
    }

    /* MenuBar 樣式 */
    .control-group {
      button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        padding: 5px 10px;
        margin-right: 5px;
        cursor: pointer;
        border-radius: 3px;

        &:hover {
          background-color: #e0e0e0;
        }

        &.is-active {
          background-color: #d0d0d0;
          border-color: #999;
        }
      }
    }
    ```
    
  - 修改 `src/pages/NotesPage.tsx` 中的 `Modal` 內容，使用 `NoteEditor` 替換原有的 `textarea`：
    ```tsx
    // ... (其他引入)
    import NoteEditor from '@/components/NoteEditor'; // 引入 NoteEditor

    const NotesPage: React.FC = () => {
      // ... (狀態和函數保持不變)

      return (
        <div>
          {/* ... (頁面標頭和新增按鈕保持不變) */}

          {/* ... (筆記列表保持不變) */}

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentNote ? '編輯筆記' : '新增筆記'}>
            <div className="space-y-4">
              <Input
                id="noteTitle"
                label="筆記標題"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="輸入筆記標題"
              />
              <div>
                <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">筆記內容</label>
                <NoteEditor
                  value={noteContent}
                  onChange={setNoteContent}
                  placeholder="輸入筆記內容..."
                />
              </div>
              <Button onClick={handleSubmitNote} className="w-full mt-4"> {/* 調整按鈕的 margin-top */}
                {currentNote ? '更新筆記' : '建立筆記'}
              </Button>
            </div>
          </Modal>
        </div>
      );
    };

    export default NotesPage;
    ```

## 5.4 筆記分類與搜尋
  為了方便管理大量的筆記，我們將添加筆記的搜尋功能。分類功能可以透過在 `Note` 介面中添加 `tags` 或 `category` 屬性來實現，並在 UI 中提供篩選選項。

  ### 1. **實作關鍵字搜尋功能**
  - 修改 `src/pages/NotesPage.tsx`，添加搜尋狀態和過濾邏輯：
    ```tsx
    import React, { useState, useMemo } from 'react'; // 引入 useMemo
    // ... (其他引入)

    const NotesPage: React.FC = () => {
      const { notes, addNote, deleteNote, updateNote } = useNotes();
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentNote, setCurrentNote] = useState<Note | null>(null);
      const [noteTitle, setNoteTitle] = useState('');
      const [noteContent, setNoteContent] = useState('');
      const [searchTerm, setSearchTerm] = useState(''); // 新增搜尋關鍵字狀態

      // ... (handleAddNote, handleEditNote, handleDeleteNote, handleSubmitNote 保持不變)

      // 過濾筆記列表
      const filteredNotes = useMemo(() => {
        if (!searchTerm) {
          return notes;
        }
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [notes, searchTerm]);

      return (
        <div>
          <PageHeader title="筆記" description="記錄您的想法和靈感。" />
          <div className="flex justify-between items-center mb-4">
            <Input 
              id="searchNotes" 
              placeholder="搜尋筆記..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xs"
            />
            <Button onClick={handleAddNote}>新增筆記</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              // 卡片內容不變
            ))}
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentNote ? '編輯筆記' : '新增筆記'}>
            // 彈窗內容不變
          </Modal>
        </div>
      );
    };

    export default NotesPage;
    ```

  至此，我們已經完成了筆記管理功能的核心實作，包括資料結構定義、使用 `React Context API` 進行狀態管理，以及整合富文本編輯器。在下一章中，我們將實作番茄鐘計時器和個人儀表板，並引入數據視覺化功能。