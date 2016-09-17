class DataBackend
{
    constructor()
    {
        this.DAY_ADD = 86400000;

        this.tasks =
        [
            { completed: false, project: 'Grabtangle', action: 'Test databinding', due: new Date('2016-09-06'), waiting: false },
            { completed: false, project: 'Raspberry PI', action: 'Check network boot stuff (@NoCode)', due: new Date('2016-08-25'), waiting: false }
        ];

        this.newTask = { project: '', action: '', due: new Date(), completed: false, waiting: false };
        this.undoTask = null;
        this.guiStateInitFunction = null;
        this.guiStatePropertyName = '';
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

        this.tasks.forEach(function(task) {
            scope.applyGuiState(task);
        });

        this.applyGuiState(this.newTask);
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

    commitNewTask()
    {
        if (this.newTask.action == '') return;

        let addTask = { project: this.newTask.project, action: this.newTask.action, due: new Date(this.newTask.due.valueOf()), completed: false, waiting: false };
        this.applyGuiState(addTask);

        this.tasks.push(addTask);
    }

    generateDates()
    {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        let tomorrow = new Date(today.valueOf() + this.DAY_ADD);

        let dow = today.getDay();

        let weekend = new Date(today.valueOf());
        if (dow > 0 && dow < 6)
        {
        weekend.setTime(weekend.valueOf() + ((6 - dow) * this.DAY_ADD));
        }

        let nextweek = new Date(today.valueOf());
        let daystonext = (7 - dow + 1) % 7; // how long to next day of week (Monday)
        if (daystonext == 0) daystonext = 7; // this means next Monday if we are already on Monday
        nextweek.setTime(nextweek.valueOf() + daystonext * this.DAY_ADD);
        
        let twoweeks = new Date(today.valueOf());
        twoweeks.setTime(twoweeks.valueOf() + 14 * this.DAY_ADD); 

        this.dates = [];
        this.dates.push({ n: 'Today', d: today});
        this.dates.push({ n: 'Tomorrow', d: tomorrow});
        this.dates.push({ n: 'Weekend', d: weekend});
        this.dates.push({ n: 'Next week', d: nextweek});
        this.dates.push({ n: '2 weeks', d: twoweeks});
    }

    getDates()
    {
        if (this.dates == null || this.dates.length < 1|| this.dates[0].getDay() != Date.getDay())
        {
            this.generateDates();
        }

        return this.dates;
    }

    
    setUndo(task)
    {
        if (!task) return;

        this.undo_obj = { completed: task.completed, project: task.project, action: task.action, category: task.category, due: new Date(task.valueOf()), waiting: task.waiting };
    }

    restore(task)
    {
        if (!this.undo_obj) return;

        task.action = this.undo_obj.action;
        this.undo_obj = null;
    }
}

module.exports = DataBackend;