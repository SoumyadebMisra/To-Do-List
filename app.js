const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemschema = mongoose.Schema({
    name: String
});

const listSchema = {
    name: String,
    items : [itemschema]
};

const Item = mongoose.model('Item',itemschema);
const List = mongoose.model('List',listSchema);

let item1 = new Item({name: "Welcome to your todolist!"});
let item2 = new Item({name: "Hit the + button to add an item."});
let item3 = new Item({name: "<-- Hit this to delete an item."});

let items = [item1,item2,item3];


app.get('/', (req,res)=>{
    Item.find((err,results)=>{
        if(err){
            console.log(err);
        } else {
            if(results.length === 0){
                Item.insertMany(items,(err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("success!");
                    }
                });

                res.redirect('/');
            } else{
                res.render('list',{titleList : 'Today',itemList : results});
            }
            
        }
        
    })
    
    
});

app.get('/:customListName',(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName},(err,listFound)=>{
        if(!err){
            if(listFound){
                res.render('list',{titleList : customListName,itemList : listFound.items})
            } else{
                const list = new List({name: customListName,items: items});
                list.save();
                res.redirect('/' + customListName);
            }
        } else{
            console.log(err);
        }
        
    })
    
});

app.get('/about',(req,res)=>{
    res.render('about');
} );


// app.post('/work',(req,res)=)

app.post('/', (req,res)=>{
    const listItem = req.body.newListItem;
    const listName = req.body.list;

    let newitem = new Item({name: listItem});
    if(listName === 'Today'){
        newitem.save();
        res.redirect('/');
    } else{
        List.findOne({name: listName},(err,foundList)=>{
            if(!err){
                foundList.items.push(newitem);
                foundList.save();
                res.redirect('/' + listName);
            }
        })
    }
    
});

app.post('/delete',(req,res)=>{
    const listName = req.body.listTitle;
    if(listName === "Today"){
        Item.findByIdAndDelete(req.body.checkbox,(err)=>{
            if(err){
                console.log(err);
            } else {
                console.log("successfully deleted.");
            }
        });
        res.redirect('/');
    } else {
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id: req.body.checkbox}}},(err,results)=>{
            if(!err){
                res.redirect('/' + listName);
            }
        });
    }
    
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});