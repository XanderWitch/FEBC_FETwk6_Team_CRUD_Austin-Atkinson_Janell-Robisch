"use strict"

//#region main classes
class Month {
    constructor(name) {
        this.name = name;
        this.goals = []
    }
}
class Goal {
    constructor(description, addedDate, deadline) {
        this.description = description;
        this.addedDate = addedDate;
        this.deadline = deadline
    }
}
//#endregion


class GoalTrackingService {
    static url = "https://crudcrud.com/api/882db0943f7c41d2b1c0494b4c2349b2/months";

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
        const today = new Date().toLocaleDateString('en-CA'); //this returns the date in yyyy-mm-dd formate required for setting value in input box
        $('#monthly-goals').empty();
        for (const month of months) {
            $('#monthly-goals').prepend(
                `
                    <div id="${month._id}" class="card">
                        <div class="card-header">
                            <h2 class="h2">${month.name}</h2>
                            <button class="btn btn-danger" onclick="DOMManager.deleteMonth('${month._id}')">Delete</button>
                        </div>
                        <div class="card-body">
                            <div>
                                <div class="row">
                                    <div class="col-sm">Date Added (today)</div>
                                    <div class="col-sm">Goal Description</div>
                                    <div class="col-sm">Deadline</div>
                                </div>
                                <div class="row">
                                    <div class="col-sm">
                                        <input type="date" id="${month._id}-goal-added" class="form-control" value="${today}" disabled>
                                    </div>
                                    <div class="col-sm">
                                        <input type="text" id="${month._id}-goal-description" class="form-control">
                                    </div>
                                    <div class="col-sm">
                                        <input type="date" id="${month._id}-goal-deadline" class="form-control">
                                    </div>
                                </div>
                                <button id="${month._id}-new-room" onclick="DOMManager.addGoal('${month._id}')" class="btn btn-primary form-control">Add</button>
                            </div>
                        </div>
                    </div><br>
                `
            );
            for (const goal of month.goals) {
                 //ToDo: add every goal for the month. with a delete button. If we have time add Edit, Update, Cancele button
            }
        }
    }

    static getAllMonthlyGoals() {
        GoalTrackingService.getAllMonthlyGoals().then(months => this.render(months))
    }

    static addGoal(id) {
    }

    static deleteGoal(houseId, roomId) {
    }

    static deleteMonth(id) {
        GoalTrackingService.deleteMonth(id)
        .then(() => {
            return GoalTrackingService.getAllMonthlyGoals();
        })
        .then((months) => this.render(months));
    }

    static createMonth(name) {
        GoalTrackingService.createMonth(new Month (name))
        .then(() => {
            return GoalTrackingService.getAllMonthlyGoals();
        })
        .then((months) => this.render(months));
    }
}

$('#create-new-month').on('click', () => {
    const txtNewMonthName = $('#new-month-name');
    DOMManager.createMonth(txtNewMonthName.val());
    txtNewMonthName.val('');
})

DOMManager.getAllMonthlyGoals();