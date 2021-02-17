# todoapp_server


### Data Model
```
{
    "_id": ObjectID,
    "email": string,
    "todo_lists": [
        {
            "_id": ObjectID,
            "title": string,
            "created_at": date,
            items: [
                {
                    "_id": ObjectID,
                    "title": string,
                    "completed": bool
                    "desc": string,
                    "priority": enum["low" | "moderate" | "high"]
                    "created_at": date,
                }
            ]
        }
    ]
}
```

### Todo
- [x] Model data using Mongoose
- [x] express-session for Session management
- [ ] Use mongo to store express-session data