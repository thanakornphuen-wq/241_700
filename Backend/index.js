const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
const port = 8000;
let users = [];
let counter = 1;

/**
 GET/users - ดึงข้อมูลผู้ใช้ทั้งหมด
 POST /users - เพิ่มผู้ใช้ใหม่
 GET/users/:id - ดึงข้อมูลผู้ใช้ตาม ID
 PUT /users/:id - แก้ไขข้อมูลผู้ใช้ตาม ID ที่บันทึก
 DELETE /users/:id - ลบผู้ใช้ตาม ID ที่บันทึก
 */

// path: = /
app.get('/users', (req, res) => {
   res.json(users);
   });   


app.post('/user',(req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1;

    users.push(user);
    res.json({
    message: 'User added successfully',
    user: user    
    });
});

app.patch('/user/:id', (req,res) => {
    let id = req.params.id;
    let updateUser = req.body;
    
    // หา user จาก id ที่ส่งมา
    let selectedIndex = users.findIndex(user => {
        if(user.id == id){
            return true
        }else{
            return false
        }
    })
  
    //อัพเดทข้อมูล users
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname;
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname;
    
    if(updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname;
    }
    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname;
    }

    res.json({
        message: 'User updated successfully',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    });
    //ส่ง users ที่อัพเดทแล้วกลับไป

    
})

app.delete('/users/:id', (req, res) => {
    let id = req.params.id;

    //หา index จาก id ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => {
        if(user.id == id){
            return true
        }else{
            return false
        }
    })
    users.splice(selectedIndex, 1);
    //ลบ user ออกจาก users
    delete users[selectedIndex];
    res.json({
        message: 'User deleted successfully',
        indexDelete: selectedIndex
    });
})

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});