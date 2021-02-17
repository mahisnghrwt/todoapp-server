# todoapp_server


### Data Model
```
{
    "_id": ObjectID,
    "email": String,
    "todo_lists": [
        {
            "_id": ObjectID,
            "title": String,
            "created_at": Date,
            todo_items: [
                {
                    "_id": ObjectID,
                    "title": String,
                    "completed": Boolean
                    "desc": String,
                    "priority": enum['low', 'moderate', 'high']
                    "created_at": Date,
                }
            ]
        }
    ]
}
```

### Bugs/Known Issues
- [ ] Model validation error in `Model.save()` causing sluggish response.

### Todo
- [x] Model data using Mongoose
- [x] express-session for Session management
- [ ] Use mongo to store express-session data