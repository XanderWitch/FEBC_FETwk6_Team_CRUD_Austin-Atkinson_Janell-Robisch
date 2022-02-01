"use strict"

//#region main classes
class Month {
    constructor(name) {
        this.name = name;
        this.goals = []
    }
    
    // //method to add a goal
    // addGoal(addedDate, description, deadline) {
    //     this.goals.push(new Goal(addedDate, description, deadline));
    // }

}

class Goal {
    constructor(addedDate, description, deadline) {
        this.addedDate = addedDate;
        this.description = description;
        this.deadline = deadline;
    }
}
//#endregion


class GoalTrackingService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

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
            url: this.url + `/${month._id}`,
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

        for (let month of months) {
            $('#monthly-goals').prepend(
                `
                    <div id="${month._id}" class="card">
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
                                        <input type="date" id="${month._id}-goal-added" class="form-control" value="${today}" disabled>
                                    </div>
                                    <div class="col-sm">
                                        <input type="text" id="${month._id}-goal-description" class="form-control">
                                    </div>
                                    <div class="col-sm">
                                        <input type="date" id="${month._id}-goal-deadline" class="form-control">
                                    </div>
                                </div>
                                <button id="${month._id}-new-goal" onclick="DOMManager.addGoal('${month._id}')" class="btn btn-primary form-control mt-3">Add New Goal</button>
                            </div>
                        </div>
                    </div>
                `
            );

            //Show each goal in the month
            for (let goal of month.goals) {

                //grab id of the month and card body and append each goal
                $(`#${month._id}`).find('.card-body').append(
                    `<p>
                        <span id="added-date-${goal._id}"><strong>Date Added</strong> ${goal.addedDate}</span>
                        
                        <span id="description-${goal._id}"><strong>Description</strong> ${goal.description}</span>
                        
                        <span id="deadline-${goal._id}"><strong>Deadline</strong> ${goal.deadline}</span>

                        <!--Button to Delete a Single Goal-->
                            <button class="btn btn-danger mt-2" onclick="DOMManager.deleteGoal('${month._id}', '${goal._id}')">Delete Goal</button>
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
        for (let month of this.months) {
            if (month._id == id) {
                //use jquery method and template literals, pound symbol to get by id
                month.goals.push(new Goal($(`#${month._id}-goal-added`).val(), $(`#${month._id}-goal-description`).val(), $(`#${month._id}-goal-deadline`).val()));

                //send request to API to update month data
                GoalTrackingService.updateMonth(month) 
                    .then(() => {
                    return GoalTrackingService.getAllMonthlyGoals();
                })
                    .then((months) => this.render(months));
       
            }
        }
    }

    static deleteGoal(monthId, goalId) {
        for (let month of this.months) {
            if (month._id == monthId) {
                for (let goal of month.goals) {
                    if (goal._id == goalId) {
                        month.goals.splice(month.goals.indexOf(goal), 1);
                        GoalTrackingService.updateMonth(month)
                            .then(() => {
                                return GoalTrackingService.getAllMonthlyGoals();
                            })
                            .then((months) => this.render(months));
                    }
                    
                }
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