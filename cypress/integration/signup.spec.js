import faker from 'faker'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    before(function(){
        cy.fixture('signup').then(function(signup){
            this.success = signup.success
            this.email_dup = signup.email_dup
            this.email_inv = signup.email_inv
            this.short_password = signup.short_password

        })
    })

    context('quando o usuário é novato', function () {
        before(function () {
            cy.task('removeUser', this.success.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')


            /* cy.intercept('POST', '/users',{  //estuta a chamada
                statusCode:200 //troca o status
            }).as('postUser') // nome para ser chamado em outro ponto */


            //cy.wait('@postUser') // espera até acontecer a troca
        })

    })

    context('quando o email ja existe', function () {
        before(function () {
            cy.postUser(this.email_dup)
        })

        it('não deve exibir o usuário', function () {
            signupPage.go()
            signupPage.form(this.email_dup)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context.only('quando o email é incorreto', function () {


        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            cy.log(this.email_inv)
            signupPage.form(this.email_inv)
            signupPage.submit()
            signupPage.alert.haveText('Informe um email válido')
        })
    })

    context('quando senha é muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abcd', 'ab#c5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve cadastrar cin a senha:  ' + p, function () {
               
                this.short_password.password = p

                
                signupPage.form(this.short_password)
                signupPage.submit()
            })

        })

        afterEach(function () {
            signupPage.alert.haveText('Pelo menos 6 caracteres')
        })

    })

    context('quando não preencho nenhum dos campos', function(){
       
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){ //acessa a pagina uma vez só e faz a validação
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('deve exibir ' + alert.toLowerCase(), function() {
                signupPage.alert.haveText(alert)
            })

        })
    })

})



