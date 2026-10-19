const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3416;

app.use(express.urlencoded({ extended: true }));
// POST /todo/1?_method=PUT → PUT /todo/1 로 처리
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 저장 (서버 재시작 시 초기화)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

app.get('/todo', (req, res) => {
  res.json(todos);
});

app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) todos.push({ id: nextId++, text });
  res.redirect('/');
});


app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    const { text, completed } = req.body; 

    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
        if (text !== undefined) todos[index].text = text;
        if (completed !== undefined) todos[index].completed = completed;
        
        res.status(200).json({ message: "수정 완료", data: todos[index] });
    } else {
        res.status(404).json({ message: "해당 할 일을 찾을 수 없습니다." });
    }
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
        const deletedTodo = todos.splice(index, 1);
        
        res.status(200).json({ message: "삭제 완료", data: deletedTodo[0] });
    } else {
        res.status(404).json({ message: "해당 할 일을 찾을 수 없습니다." });
    }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
