class DataBackend
{
    constructor()
    {
        this.tasks = [
            { ui_state: { isOpen: false, date_open: false, cal_open: false }, completed: false, project: 'Grabtangle', action: 'Test databinding', due: new Date('2016-09-06'), waiting: false },
            { ui_state: { isOpen: false, date_open: false, cal_open: false }, completed: false, project: 'Raspberry PI', action: 'Check network boot stuff (@NoCode)', due: new Date('2016-08-25'), waiting: false }
            ];
    }

    getTasks()
    {
        return this.tasks;
    }
}

module.exports = DataBackend;