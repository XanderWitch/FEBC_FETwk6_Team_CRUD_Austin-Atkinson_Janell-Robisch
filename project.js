"use strict"

//#region main classes
class Month {
    constructor(name, guid) {
        this.name = name;
        this.guid = guid;
        this.goals = []
    }

    // //method to add a goal
    // addGoal(addedDate, description, deadline) {
    //     this.goals.push(new Goal(addedDate, description, deadline));
    // }

}

class Goal {
    constructor(addedDate, description, deadline, guid) {
        this.addedDate = addedDate;
        this.description = description;
        this.deadline = deadline;
        this.guid = guid;
    }
}
//#endregion


class GoalTrackingService {
    static url = 'https://crudcrud.com/api/5f069397c722405b9daaf7c93056a165/months';

    static getAllMonthlyGoals() {
        return $.get(this.url);
    }

    static getMonthById(id) {
        return $.get(`${this.url}/${id}`);
    }

    static createMonth(month) {
        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(month),
            contentType: 'application/json',
            type: 'POST'
        });
    }

    static updateMonth(month) {
        const monthId = month._id;
        delete month._id;

        return $.ajax({
            url: `${this.url}/${monthId}`,
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
                    <div id="${month.guid}" class="card">
                        <div class="card-header">
                            <h2 class="h2">${month.name}</h2>
                            <button class="btn btn-danger mt-2" onclick="DOMManager.deleteMonth('${month._id}')">Delete</button>
                        </div>
                        <div class="card-body">
                            <div>
                                <div class="row">
                                    <div class="col-sm">Date Added (today)</div>
                                    <div class="col-sm">Goal Name/Description</div>
                                    <div class="col-sm">Deadline</div>
                                </div>
                                <div class="row">
                                    <div class="col-sm">
                                        <input type="date" id="${month.guid}-goal-added" class="form-control" value="${today}" disabled>
                                    </div>
                                    <div class="col-sm">
                                        <input type="text" id="${month.guid}-goal-description" class="form-control">
                                    </div>
                                    <div class="col-sm">
                                        <input type="date" id="${month.guid}-goal-deadline" class="form-control">
                                    </div>
                                </div>
                                <button id="${month.guid}-new-goal" onclick="DOMManager.addGoal('${month.guid}')" class="btn btn-primary form-control mt-3">Add New Goal</button>
                            </div>
                        </div>
                    </div>
                `
            );

            //Show each goal in the month
            for (const goal of month.goals) {

                //grab id of the month and card body and append each goal
                $(`#${month.guid}`).find('.card-body').append(
                    `<p>
                        <span id="added-date-${goal.guid}"><strong>Date Added</strong> ${goal.addedDate}</span>
                        
                        <span id="description-${goal.guid}"><strong>Description</strong> ${goal.description}</span>
                        
                        <span id="deadline-${goal.guid}"><strong>Deadline</strong> ${goal.deadline}</span>

                        <!--Button to Delete a Single Goal-->
                            <button class="btn btn-danger mt-2" onclick="DOMManager.deleteGoal('${month.guid}', '${goal.guid}')">Delete Goal</button>
                    </p>`
                )

                //ToDo: add every goal for the month. with a delete button. If we have time add Edit, Update, Cancele button
                //Or a checkbox ? and completed goals?
            }
        }
    }

    static getAllMonthlyGoals() {
        GoalTrackingService.getAllMonthlyGoals().then(months => this.render(months))
    }

    static addGoal(id) { //*** */

        //look at each month in our month array
        for (const month of this.months) {
            if (month.guid === id) {
                //use jquery method and template literals, pound symbol to get by id
                month.goals.push(new Goal($(`#${month.guid}-goal-added`).val(), $(`#${month.guid}-goal-description`).val(), $(`#${month.guid}-goal-deadline`).val(), CreateGuid()));

                //send request to API to update month data
                GoalTrackingService.updateMonth(month)
                    .then(() => {
                        return GoalTrackingService.getAllMonthlyGoals();
                    })
                    .then((months) => this.render(months));
                break;
            }
        }
    }

    static deleteGoal(monthId, goalId) {
        for (const month of this.months) {
            if (month.guid === monthId) {
                for (const goal of month.goals) {
                    if (goal.guid === goalId) {
                        month.goals.splice(month.goals.indexOf(goal), 1);
                        GoalTrackingService.updateMonth(month)
                            .then(() => {
                                return GoalTrackingService.getAllMonthlyGoals();
                            })
                            .then((months) => this.render(months));
                        break;
                    }
                }
                break;
            }
        }
    }

    static deleteMonth(id) {
        GoalTrackingService.deleteMonth(id)
            .then(() => {
                return GoalTrackingService.getAllMonthlyGoals();
            })
            .then((months) => this.render(months));
    }

    static createMonth(name) {
        GoalTrackingService.createMonth(new Month(name, CreateGuid()))
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


function CreateGuid() {
    function _p8(s) {
        let p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}