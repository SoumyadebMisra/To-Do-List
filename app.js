const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

items = [];
workListItems = [];
let today = new Date();
options = {
    weekday : 'long',
    month : 'long',
    day : 'numeric'
}

let day= today.toLocaleDateString('en-US',options);

app.get('/', (req,res)=>{
    res.render('list',{titleList : day,itemList : items});
});

app.get('/about',(req,res)=>{
    res.render('about');
} );

app.get('/work',(req,res)=>{
    res.render('list',{titleList : 'Work List',itemList : workListItems})
} );

// app.post('/work',(req,res)=)

app.post('/', (req,res)=>{
    const listItem = req.body.newListItem;
    if(req.body.button === 'Work List'){
        workListItems.push(listItem);
        res.redirect('/work');
    }
    else{
        items.push(listItem);
        res.redirect('/');
    }
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});