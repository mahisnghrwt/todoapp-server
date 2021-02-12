# todoapp_server


### Data Model
```
{
    "user_id": ObjectID,
    "user_email": string,
    "todo_lists": [
        {
            "title": string,
            "created_at": date,
            items: [
                {
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
- [ ] Model data using Mongoose
- [x] express-session for Session management
- [ ] Use mongo to store express-session data