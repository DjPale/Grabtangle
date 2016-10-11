const DAY_ADD = 86400000;
const UNDO_NONE = Symbol('None');
const UNDO_ADD = Symbol('Add');
const UNDO_DELETE = Symbol('Delete');
const UNDO_UPDATE = Symbol('Update');

class DataBackend
{
    constructor(backend)
    {
        this.backend = backend;

        this.tasks = [];
        this.dates = [];
        this.newTask = { project: '', action: '', due: new Date(), completed: false, waiting: false };
        this.undo = { taskCopy: null, taskRef: null, undoType: UNDO_NONE, text: '', active: false };
        this.guiStateInitFunction = null;
        this.guiStatePropertyName = '';

        this.autoMoveWaiting = true;
        this.onUpdated = null;
    }

    alignDate(dt)
    {
        dt.setHours(0);
        dt.setMinutes(0);
        dt.setSeconds(0);
        dt.setMilliseconds(0);
    }

    checkWaiting(now)
    {
        if (!this.autoMoveWaiting) return;

        this.tasks.forEach(function(task)
        {
            if (task.due <= now)
            {
                task.waiting = false;
            }
        });
    }

    applyGuiState(task)
    {
        if (task && this.guiStateInitFunction && !task[this.guiStatePropertyName]) this.guiStateInitFunction(task); 
    }
    
    setGuiStateInit(statePropertyName, stateInitFunction)
    {
        this.guiStatePropertyName = statePropertyName;
        this.guiStateInitFunction = stateInitFunction;

        let scope = this;

        if (this.tasks)
        {
            this.tasks.forEach(function(task) 
            {
                scope.applyGuiState(task);
            });
        }

        this.applyGuiState(this.newTask);
    }

    adviseWrite(callback = null)
    {
        this.backend.writeData('tasks', this.tasks, callback);
    }

    loadData(callback = null)
    {
        let scope = this;
        let now = new Date();
        this.alignDate(now);
 
        this.backend.readData('tasks', function(error, data)
        {
            data.forEach(function(task) 
            {
                if (!task.completed)
                {
                    task.due = new Date(task.due);
                    scope.alignDate(task.due);

                    if (scope.autoMoveWaiting && task.due <= now) 
                    {
                        task.waiting = false;
                    }

                    scope.tasks.push(task);
                }
            });

            if (callback) callback(this.tasks);
        });
    }

    copyTask(src, dst)
    {
        if (!src || !dst) return;

        dst.project = src.project;
        dst.action = src.action;
        dst.due = new Date(src.due.valueOf());
        dst.waiting = src.waiting;
        dst.completed = src.completed;
    }

    setUndo(task, text = null, undoType = UNDO_UPDATE)
    {
        if (!task) return;

        this.undo.undoType = undoType;
        this.undo.taskRef = task;
        this.undo.taskCopy = {};

        this.copyTask(task, this.undo.taskCopy);

        if (text)
        {
            this.undo.text = text;
            this.undo.active = true;
        }    
    }

    clearUndo()
    {
        this.undo.active = false;
        this.undo.text = '';
        this.undo.taskCopy = null;
        this.undo.taskRef = null;
        this.undo.undoType = UNDO_NONE;

        this.adviseWrite();
    }

    restoreUndo(clearAfter = true)
    {
        if (!this.undo.taskRef || this.undo.undoType == UNDO_NONE) return false;

        let u = this.undo;

        if (u.undoType == UNDO_ADD)
        {
            let idx = this.tasks.findIndex(function(element, index, array)
            {
                return (u.taskRef == element);
            });

            if (idx != -1) this.tasks.splice(idx, 1);
        }
        else if (u.undoType == UNDO_UPDATE)
        {
            this.copyTask(u.taskCopy, u.taskRef);
        }

        if (clearAfter) this.clearUndo();

        return true;
    }

    getTasks()
    {
        return this.tasks;
    }

    getNewTask()
    {
       return this.newTask;
    }

    clearNewTask()
    {
        this.newTask.project = '';
        this.newTask.action = '';
        this.newTask.due = new Date(); 
    }

    commitNewTask(commitText = null)
    {
        if (this.newTask.action == '') return;

        let addTask = { project: this.newTask.project, action: this.newTask.action, due: new Date(this.newTask.due.valueOf()), completed: false, waiting: false };

        this.tasks.push(addTask);
        this.setUndo(addTask, commitText, UNDO_ADD);

        this.applyGuiState(addTask);
    }

    generateDates()
    {
        let today = new Date();
        this.alignDate(today);

        let tomorrow = new Date(today.valueOf() + DAY_ADD);

        let dow = today.getDay();

        let later_add = Math.min(dow + 2, 5);
        if (dow == 0 || dow == 6) later_add = 0; 

        let later = new Date(today.valueOf() + ((later_add - dow) * DAY_ADD));

        let weekend = new Date(today.valueOf());
        if (dow > 0 && dow < 6)
        {
            weekend.setTime(weekend.valueOf() + ((6 - dow) * DAY_ADD));
        }

        let nextweek = new Date(today.valueOf());
        let daystonext = (7 - dow + 1) % 7; // how long to next day of week (Monday)
        if (daystonext == 0) daystonext = 7; // this means next Monday if we are already on Monday
        nextweek.setTime(nextweek.valueOf() + daystonext * DAY_ADD);
        
        let twoweeks = new Date(today.valueOf());
        twoweeks.setTime(twoweeks.valueOf() + 14 * DAY_ADD); 

        this.dates.length = 0;
        this.dates.push({ n: 'Today', d: today});
        this.dates.push({ n: 'Tomorrow', d: tomorrow});
        this.dates.push({ n: 'Later in week', d: later});
        this.dates.push({ n: 'Weekend', d: weekend});
        this.dates.push({ n: 'Next week', d: nextweek});
        this.dates.push({ n: '2 weeks', d: twoweeks});
    }

    checkRegenerateDynamicData()
    {
        var now = new Date();
        if (this.dates.length == 0 || now.getDay() != this.dates[0].d.getDay())
        {
            this.generateDates();
            this.checkWaiting(now);

            if (this.onUpdated != null)
            {
                this.onUpdated();
            }
        }
    }

    getDates()
    {
        this.generateDates();

        return this.dates;
    }

    getUndo()
    {
        return this.undo;
    }
}

module.exports = DataBackend;