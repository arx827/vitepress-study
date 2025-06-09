---
title: React 實戰影音課 2
---

# 2. 解構
## 打開檔案 `/es6/destructuringAssignment.html`

## 1. 取出特定值作為變數
  ```ts
  const person = {
    name: '小明',
    age: 16,
    like: '鍋燒意麵'
  }

  const {name, age} = person;
  ```

## 2. 陣列解構
  ```ts
  const array = ['小明', '杰倫', '漂亮阿姨'];

  const [Ming, Jay, Auntie] = array;
  ```

## 3. 解構加展開
  ```ts
  const people = {
    Ming: {
      name: '小明',
      age: 16,
      like: '鍋燒意麵'
    },
    Jay: {
      name: '杰倫',
      age: 18,
      like: '跑車'
    },
    Auntie: {
      name: '漂亮阿姨',
      age: 22,
      like: '名牌包'
    }
  }

  const { Ming, ...other } = people;
  ```

## 4. 解構加上重新命名
  ```ts
  let Ming = {
    name: '小明',
    age: 16,
    like: '鍋燒意麵'
  }

  const { age: MingAge } = Ming
  ```

## 5. 函式參數解構
  ```ts
  const person = {
    name: '小明',
    age: 16,
    like: '鍋燒意麵'
  }

  function callName({ name, age }) {
    console.log(name, age);
  }
  callName(person);
  ```

## 6. 解構在 React 的運用
  ```ts
  const { useState } = React;

  function Card({person}) {
    return (<div className="card">
      <div className="card-body">
        {person.name}
      </div>
    </div>)
  }

  function App() {
    const [person, setPerson] = useState({
      name: '小明',
    })

    return (
      <div>
        我是{person.name}
        <Card person={person} ></Card>
      </div>
    )
  }
  ```
