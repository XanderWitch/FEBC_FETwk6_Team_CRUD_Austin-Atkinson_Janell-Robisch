"use strict"

//#region main classes
class Month {
    constructor(month){
        this.month = month;
        this.goals = []
    }
}
class Goal{
    constructor(description, addedDate, deadline){
        this.description = description;
        this.addedDate = addedDate;
        this.deadline = deadline
    }
}
//#endregion


class  GoalTrackingService{
    static url = ""; //ToDo: find the URL to put the app on

    static getAllMonthlyGoals() {
        return $.get(this.url);
    }

    static getMonthById(id) {
        return $.get(`${this.url}/${id}`);
    }

    static createMonth(month) {
        return $.post(this.url, month);
    }

    static updateMonth(month) {
        return $.ajax({
            url: `${this.url}/${month._id}`,
            dataType: 'json',
            data: JSON.stringify(month),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteMonth(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static months;

    static render(months) {
        this.months = months;
        $('#monthly-goals').empty();
        for (const month of months) {
            $('#monthly-goals').prepend(); //ToDo: Add all the months in Months[] with Goal and Deadline. Maybe add an noneditable textbox with todays date for date added?
            for (const month of month.goals) {
                $(`#${house._id}`).find('.card-body').append(); //ToDo: add every goal for the month. with a delete button. If we have time add Edit, Update, Cancele button
            }
        }
    }

    static getAllMonthlyGoals() {
    }

    static addGoal(id) {
    }

    static deleteGoal(houseId, roomId) {
    }

    static deleteMonth(id) {
    }

    static createMonth(month) {
    }
}

DOMManager.getAllMonthlyGoals();