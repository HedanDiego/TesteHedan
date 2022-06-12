import { el } from './elements'
import header from '../../components/header'

class DashPage {

    constructor() {
        this.header = header
    }

    calendarShoudlBeVisible(){
        cy.get(el.calendar, {timeout: 7000})
            .should('be.visible')
    }

    selectDay(day) {

        let today = new Date()
        let lastDayOdMonth = new Date(today.getFullYear(), today.getMonth() +1, 0)

        if(today.getDate() === lastDayOdMonth.getDate()){
            cy.log('Hoje e ultimo dia do mes')
            cy.get(el.nextMonthButton)
                .should('be.visible')
                .click()
                
        } else {
            cy.log('Hoje nao e o ultimo dia do mes')
        }

        cy.log(today.toString())
        cy.log(lastDayOdMonth.toString())

        const target = new RegExp('^' + day + '$', 'g')
        cy.contains(el.boxDay, target)
            .click({force:true})
    }

    appointmentShouldBe(customer, hour) {
        cy.contains('div', customer.name)
            .should('be.visible')
            .parent()
            .contains(el.boxHour, hour)
            .should('be.visible')
    }

}

export default new DashPage()