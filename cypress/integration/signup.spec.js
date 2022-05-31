import faker from 'faker'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    context('quando o usuário é novato', function () {
        const user = {
            name: 'Hedan Costa',
            email: 'hedan.costa@teste.com',
            password: 'asd123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveTest('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')


            /* cy.intercept('POST', '/users',{  //estuta a chamada
                statusCode:200 //troca o status
            }).as('postUser') // nome para ser chamado em outro ponto */


            //cy.wait('@postUser') // espera até acontecer a troca
        })

    })

    context('quando o email ja existe', function () {
        const user = {
            name: 'Diego Costa',
            email: 'diego.costa@teste.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('não deve exibir o usuário', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveTest('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email é incorreto', function () {
        const user = {
            name: 'Diego Costa',
            email: 'diego.costateste.com',
            password: 'pwd123'
        }

        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando senha é muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abcd', 'ab#c5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve cadastrar cin a senha:  ' + p, function () {
                const user = { name: 'Diego Costa', email: 'diego.costa@teste.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })

        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
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
                signupPage.alertHaveText(alert)
            })

        })
    })

})



