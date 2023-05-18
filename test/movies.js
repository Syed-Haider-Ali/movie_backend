const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')


//Assertion style
chai.should()

chai.use(chaiHttp)

describe('Movies API', ()=>{

// if call done() in end() -- then it also tells execution time

describe('GET /movies', ()=>{
    it('It should get all the movies', (done)=>{

        chai.request(server)
            .get('/movies')
            .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('array')

             done()
                
            })
    })

    // it('It should NOT get all the movies', (done)=>{

    //     chai.request(server)
    //         .get('/movie')
    //         .end((err, res)=>{
    //             res.should.have.status(404)
    //         })
    //     done()
    // })
});

describe('GET /movie/:title', ()=>{
    it('It should GET a movie (Sultan)', (done)=>{
        const title = 'Sultan' 
        chai.request(server)
            .get('/movie/' + title)
            .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
             done()
                
            })
    })

    it('It should NOT GET a movie (Sultan)', (done)=>{
        const title = 'ultan' 
        chai.request(server)
            .get('/movie/' + title)
            .end((err, res)=>{
                res.should.have.status(404)

                done()

            })
    })
});
    




});