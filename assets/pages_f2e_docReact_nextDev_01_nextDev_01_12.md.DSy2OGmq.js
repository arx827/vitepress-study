import{_ as s,o as a,c as p,a0 as e}from"./chunks/framework.DgPozsi0.js";const m=JSON.parse('{"title":"[Next.js官網] Next.js 16.2 教程","description":"","frontmatter":{"title":"[Next.js官網] Next.js 16.2 教程"},"headers":[],"relativePath":"pages/f2e/docReact/nextDev/01/nextDev_01_12.md","filePath":"pages/f2e/docReact/nextDev/01/nextDev_01_12.md"}'),l={name:"pages/f2e/docReact/nextDev/01/nextDev_01_12.md"};function r(i,n,c,b,t,o){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="處理錯誤" tabindex="-1">處理錯誤 <a class="header-anchor" href="#處理錯誤" aria-label="Permalink to &quot;處理錯誤&quot;">​</a></h1><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在上一章中，你學到了如何使用 Server Actions 異動資料。讓我們來看看，如何使用 JavaScript 的 \`try/catch\` 陳述式與 Next.js 的 API，優雅地處理未被攔截的例外狀況（uncaught exceptions）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**本章內容**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>以下是本章將涵蓋的主題：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如何使用特殊的 \`error.tsx\` 檔案，攔截路由區段中的錯誤，並向使用者顯示備援（fallback）UI。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如何使用 \`notFound\` 函式與 \`not-found\` 檔案，處理 404 錯誤（用於不存在的資源）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 為 Server Actions 加入 \`try/catch\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>首先，讓我們在你的 Server Actions 中加入 JavaScript 的 \`try/catch\` 陳述式，讓你能夠優雅地處理錯誤。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如果你知道該怎麼做，可以花幾分鐘更新你的 Server Actions，或者你也可以直接複製下方的程式碼：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>展開查看解答</span></span>
<span class="line"><span></span></span>
<span class="line"><span>請注意，\`redirect\` 是在 \`try/catch\` 區塊**外**呼叫的。這是因為 \`redirect\` 的運作方式是拋出（throw）一個錯誤，這個錯誤會被 \`catch\` 區塊攔截到。為了避免這種情況，你可以在 \`try/catch\` 結束**之後**才呼叫 \`redirect\`。只有當 \`try\` 執行成功時，程式才會執行到 \`redirect\`。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>我們透過攔截資料庫的問題，並從 Server Action 回傳一則有用的訊息，優雅地處理了這些錯誤。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如果你的 action 中出現了未被攔截的例外狀況，會發生什麼事呢？我們可以透過手動拋出一個錯誤來模擬這個情況。舉例來說，在 \`deleteInvoice\` 這個 action 中，在函式最上方拋出一個錯誤：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/app/lib/actions.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export async function deleteInvoice(id: string) {</span></span>
<span class="line"><span>throw new Error(&#39;Failed to Delete Invoice&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Unreachable code block</span></span>
<span class="line"><span>await sqlDELETE FROM invoices WHERE id = \${id};</span></span>
<span class="line"><span>revalidatePath(&#39;/dashboard/invoices&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>當你嘗試刪除一筆發票時，你應該會在本機伺服器（localhost）上看到這個錯誤。而在正式環境（production）中，當發生非預期的狀況時，你會希望能更優雅地向使用者顯示一則訊息。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>這正是 Next.js 的[\`error.tsx\`](https://nextjs.org/docs/app/api-reference/file-conventions/error)檔案派上用場的地方。請確認在測試完畢、進入下一個段落之前，先移除這段手動加入的錯誤程式碼。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 使用 \`error.tsx\` 處理所有錯誤</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`error.tsx\` 檔案可以用來為某個路由區段定義一個 UI 邊界（boundary）。它可以作為一個**萬用（catch-all）**機制，用來攔截非預期的錯誤，並向使用者顯示備援 UI。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在你的 \`/dashboard/invoices\` 資料夾中，建立一個名為 \`error.tsx\` 的新檔案，並貼上以下程式碼：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/dashboard/invoices/error.tsx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&#39;use client&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import { useEffect } from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function Error({</span></span>
<span class="line"><span>error,</span></span>
<span class="line"><span>reset,</span></span>
<span class="line"><span>}: {</span></span>
<span class="line"><span>error: Error &amp; { digest?: string };</span></span>
<span class="line"><span>reset: () =&gt; void;</span></span>
<span class="line"><span>}) {</span></span>
<span class="line"><span>useEffect(() =&gt; {</span></span>
<span class="line"><span>// Optionally log the error to an error reporting service</span></span>
<span class="line"><span>console.error(error);</span></span>
<span class="line"><span>}, [error]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return (</span></span>
<span class="line"><span>&lt;main className=&quot;flex h-full flex-col items-center justify-center&quot;&gt;</span></span>
<span class="line"><span>&lt;h2 className=&quot;text-center&quot;&gt;Something went wrong!&lt;/h2&gt;</span></span>
<span class="line"><span>&lt;button</span></span>
<span class="line"><span>className=&quot;mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400&quot;</span></span>
<span class="line"><span>onClick={</span></span>
<span class="line"><span>// Attempt to recover by trying to re-render the invoices route</span></span>
<span class="line"><span>() =&gt; reset()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&gt;</span></span>
<span class="line"><span>Try again</span></span>
<span class="line"><span>&lt;/button&gt;</span></span>
<span class="line"><span>&lt;/main&gt;</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>關於上面這段程式碼，有幾件事值得注意：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- **&quot;use client&quot;**：\`error.tsx\` 必須是一個用戶端元件（Client Component）。</span></span>
<span class="line"><span>- 它接收兩個 props：</span></span>
<span class="line"><span>  * \`error\`：這個物件是 JavaScript 原生[\`Error\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)物件的一個實例。</span></span>
<span class="line"><span>  * \`reset\`：這是一個用來重設錯誤邊界（error boundary）的函式。當這個函式被執行時，會嘗試重新渲染該路由區段。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>當你再次嘗試刪除一筆發票時，你應該會看到以下的 UI 畫面：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![error.tsx 檔案，顯示它所接收的 props](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Ferror-page.png&amp;w=1920&amp;q=75)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 使用 \`notFound\` 函式處理 404 錯誤</span></span>
<span class="line"><span></span></span>
<span class="line"><span>另一種優雅處理錯誤的方式，是使用 \`notFound\` 函式。雖然 \`error.tsx\` 適合用來攔截未被處理的例外狀況，但當你嘗試擷取一個不存在的資源時，就可以使用 \`notFound\`。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>舉例來說，造訪 \`http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit\`。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>這是一個在你的資料庫中並不存在的假 UUID。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你會立刻看到 \`error.tsx\` 被觸發，因為這是 \`/invoices\` 的子路由，而 \`error.tsx\` 就是在該處被定義的。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不過，如果你想要更精確一些，可以顯示一個 404 錯誤，告訴使用者他們嘗試存取的資源並不存在。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你可以前往 \`data.ts\` 中的 \`fetchInvoiceById\` 函式，並為回傳的 \`invoice\` 加入一段 console log，藉此確認資源確實不存在：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/app/lib/data.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export async function fetchInvoiceById(id: string) {</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(invoice); // Invoice is an empty array []</span></span>
<span class="line"><span>return invoice[0];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} catch (error) {</span></span>
<span class="line"><span>console.error(&#39;Database Error:&#39;, error);</span></span>
<span class="line"><span>throw new Error(&#39;Failed to fetch invoice.&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>現在你已經確認這筆發票在資料庫中並不存在，讓我們使用 \`notFound\` 來處理這個情況。前往 \`/dashboard/invoices/[id]/edit/page.tsx\`，並從 \`&#39;next/navigation&#39;\` 匯入 \`{ notFound }\`。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，你可以使用條件判斷式，在發票不存在時呼叫 \`notFound\`：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/dashboard/invoices/[id]/edit/page.tsx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import { fetchInvoiceById, fetchCustomers } from &#39;@/app/lib/data&#39;;</span></span>
<span class="line"><span>import { notFound } from &#39;next/navigation&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default async function Page(props: { params: Promise&lt;{ id: string }&gt; }) {</span></span>
<span class="line"><span>const params = await props.params;</span></span>
<span class="line"><span>const id = params.id;</span></span>
<span class="line"><span>const [invoice, customers] = await Promise.all([</span></span>
<span class="line"><span>fetchInvoiceById(id),</span></span>
<span class="line"><span>fetchCustomers(),</span></span>
<span class="line"><span>]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (!invoice) {</span></span>
<span class="line"><span>notFound();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，為了向使用者顯示錯誤 UI，在 \`/edit\` 資料夾內建立一個 \`not-found.tsx\` 檔案。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![位於 edit 資料夾內的 not-found.tsx 檔案](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Fnot-found-file.png&amp;w=3840&amp;q=75)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在 \`not-found.tsx\` 檔案中，貼上以下程式碼：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/dashboard/invoices/[id]/edit/not-found.tsx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import Link from &#39;next/link&#39;;</span></span>
<span class="line"><span>import { FaceFrownIcon } from &#39;@heroicons/react/24/outline&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function NotFound() {</span></span>
<span class="line"><span>return (</span></span>
<span class="line"><span>&lt;main className=&quot;flex h-full flex-col items-center justify-center gap-2&quot;&gt;</span></span>
<span class="line"><span>&lt;FaceFrownIcon className=&quot;w-10 text-gray-400&quot; /&gt;</span></span>
<span class="line"><span>&lt;h2 className=&quot;text-xl font-semibold&quot;&gt;404 Not Found&lt;/h2&gt;</span></span>
<span class="line"><span>&lt;p&gt;Could not find the requested invoice.&lt;/p&gt;</span></span>
<span class="line"><span>&lt;Link href=&quot;/dashboard/invoices&quot; className=&quot;mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400&quot; &gt;</span></span>
<span class="line"><span>Go Back</span></span>
<span class="line"><span>&lt;/Link&gt;</span></span>
<span class="line"><span>&lt;/main&gt;</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>重新整理該路由，你現在應該會看到以下的 UI 畫面：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![404 找不到頁面畫面](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2F404-not-found-page.png&amp;w=1920&amp;q=75)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>這是一個值得留意的地方：\`notFound\` 的優先順序會高於 \`error.tsx\`，因此當你想要處理更精確的錯誤情境時，可以善用這個函式！</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 延伸閱讀</span></span>
<span class="line"><span></span></span>
<span class="line"><span>想更深入了解 Next.js 中的錯誤處理，可以參考以下文件：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- [錯誤處理](https://nextjs.org/docs/app/building-your-application/routing/error-handling)</span></span>
<span class="line"><span>- [\`error.js\` API 參考文件](https://nextjs.org/docs/app/api-reference/file-conventions/error)</span></span>
<span class="line"><span>- [\`notFound()\` API 參考文件](https://nextjs.org/docs/app/api-reference/functions/not-found)</span></span>
<span class="line"><span>- [\`not-found.js\` API 參考文件](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 你已完成第十二章</span></span>
<span class="line"><span></span></span>
<span class="line"><span>太好了，你現在已經能夠優雅地處理應用程式中的錯誤了。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**下一步**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**13：提升無障礙性（Improving Accessibility）**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>讓我們繼續探索提升使用者體驗的方法。你將學到伺服器端表單驗證，以及如何提升無障礙性。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[開始第十三章](https://nextjs.org/learn/dashboard-app/improving-accessibility)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br></div></div>`,2)])])}const d=s(l,[["render",r]]);export{m as __pageData,d as default};
