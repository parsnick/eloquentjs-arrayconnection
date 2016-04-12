import 'sinon-as-promised';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {expect} from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
chai.use(chaiAsPromised);

import {Model as BaseModel} from 'laravel-eloquentjs';
import ArrayConnection from '../src/ArrayConnection';

describe('Model using ArrayConnection', function () {

    let Post;
    let ROWS;
    let MODELS;

    beforeEach('set up model using connection', function () {

        ROWS = [
            { id: 1, title: 'My First Post' },
            { id: 2, title: 'My Second Post' },
            { id: 3, title: 'My Third Post' }
        ];

        Post = class extends BaseModel {};
        Post.prototype.connection = new ArrayConnection(ROWS);

        MODELS = ROWS.map(data => new Post(data));
    })

    it('creates records', function() {
        const NEW_POST_DATA = { title: 'hello' };

        return Post.create(NEW_POST_DATA).then(model => {
            expect(model).to.be.an.instanceOf(Post);
            expect(model.exists).to.be.true;
            expect(ROWS).to.contain(NEW_POST_DATA);
        });
    });

    context('read()', function() {
        it('fetches all records', function() {
            return expect(Post.all()).to.eventually.eql(MODELS);
        });

        it('limits the results', function() {
            const firstTwo = [ MODELS[0], MODELS[1] ];

            return expect(Post.limit(2).get()).to.eventually.eql(firstTwo);
        });

        it('offsets the results', function() {
            const skipFirst = MODELS.slice(1);

            return expect(Post.offset(1).get()).to.eventually.eql(skipFirst);
        });

        it('finds a record by ID', function() {
            return expect(Post.find(1)).to.eventually.eql(MODELS[0]);
        });

        it('applies a where(column, value) clause', function() {
            const thirdPost = MODELS.filter(model => model.id == 3);

            return expect(Post.where('title', 'My Third Post').get()).to.eventually.eql(thirdPost);
        });
    });

    context('update()', function() {
        it('updates all records matching the current query', function() {
            return Post.update({ title: 'UPDATED' }).then(results => {
                expect(ROWS[0].title).to.equal('UPDATED');
                expect(ROWS[1].title).to.equal('UPDATED');
                expect(ROWS[2].title).to.equal('UPDATED');
            });
        });

        it('updates the current instance', function() {
            return Post.find(1).then(post => {
                return post.update({ title: '#1 UPDATE' }).then(post => {

                });
            });
        });
    });

    context('delete()', function() {
        it('deletes all records matching the current query', function() {
            return Post.delete().then(results => {
                return expect(Post.all()).to.eventually.have.length(0);
            });
        });

        xit('deletes the current instance', function() {
            return Post.find(1).then();
        });
    });

});
