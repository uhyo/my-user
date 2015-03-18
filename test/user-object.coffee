assert=require 'assert'

my_user=require '../'

describe 'User object',->
    describe 'authenticate & versioning',->
        config=null
        beforeEach ->
            config=my_user.init()

        it 'user id',->
            user=config.create "id"

            assert.strictEqual user.id,"id"

        it 'default user version',->
            user=config.create "id"
            user.setData {},"password"
            assert.strictEqual user.version,0

        it 'default authenticats',->
            user=config.create "id"
            user.setData {},"password"

            assert.strictEqual user.auth("foobar"),false,"wrong password"
            assert.strictEqual user.auth("password"),true,"correct password"

        it 'user versioning',->
            config.setSalt 1,16
            user=config.create "id"
            user.setData {},"foo"

            assert.strictEqual user.version,1

            #version up
            config.setPasswordHash 2,"md5"
            user2=config.create "id2"
            user2.setData {},"bar"

            assert.strictEqual user2.version,2

            #version up
            user.setData {},"baz"

            assert.strictEqual user.version,2

            #version down
            user2.setData {},"foo",1

            assert.strictEqual user2.version,1

        it 'user-defined salt',->
            config.setSalt 1,->
                # static salt
                "foobar"
            user=config.create "id"

            user.setData {},"password"

            assert.strictEqual user.salt,"foobar"

            config.setSalt 2,->
                # version up
                "hogehoge"

            user.setData {},"passwordv2"

            assert.strictEqual user.salt,"hogehoge"

        it 'user-defined passwordhash',->
            config.setSalt 1,->
                "salt"

            config.setPasswordHash 1,(salt,password)->
                salt+password
            user=config.create "id"

            user.setData {},"password"

            assert.strictEqual user.password,"saltpassword"

        it 'partial upgrading',->
            config.setSalt 1,->
                "salt"
            config.setPasswordHash 1,(salt,password)->
                salt+password

            user=config.create "id"
            user.setData {},"foo"

            assert.strictEqual user.password,"saltfoo"

            # set without changing password
            user.setData {foo:3}

            assert.strictEqual user.password,"saltfoo"

            config.setPasswordHash 2,(salt,password)->
                salt+password+password

            # still version 1
            assert.strictEqual user.version,1

            # can't upgrade without changing password
            assert.throws ->
                user.setData {bar:5}
        it 'partial upgrading 2',->
            config.setSalt 1,->
                "salt"
            config.setPasswordHash 1,(salt,password)->
                salt+password
            
            user=config.create "id"
            user.setData {},"foo"

            config.setPasswordHash 2,(salt,password)->
                salt+password+password

            # upgrade user
            user.setData {foo:3},"bar"
            
            assert.strictEqual user.password,"saltbarbar"

    describe 'user data',->
        config=null
        beforeEach ->
            config=my_user.init()

        it 'save & store data',->
            user=config.create "id"

            data=
                foo: "bar"
                baz: -500
            user.setData data,"password"

            assert.deepEqual user.getData(),{
                foo: "bar",
                baz: -500
            }
        it 'data is frozen',->
            user=config.create "id"

            user.setData {},"password"

            assert Object.isFrozen user.getData()
            
        it 'clones data',->
            user=config.create "id"

            data=
                foo: "bar"
                baz: -500
            user.setData data,"password"

            # modify
            data.quux="a"

            assert.deepEqual user.getData(),{
                foo: "bar"
                baz: -500
            }

            user.setData data
            assert.deepEqual user.getData(),{
                foo: "bar"
                baz: -500
                quux: "a"
            }
        it 'loads data',->
            user=config.create()

            user.loadRawData {
                id:"id"
                data:
                    foo: "bar"
                    baz: -500
            }

            assert.deepEqual user.id,"id"
            assert.deepEqual user.getData(),{
                foo: "bar"
                baz: -500
            }
        it 'load raw & authenticate',->
            config.setPasswordHash 1,"sha256"
            user=config.create()
            user.loadRawData {
                version: 1
                salt:"salt"
                # echo -n "saltpassword" | sha256sum
                password:"13601bda4ea78e55a07b98866d2be6be0744e3866f13c00c811cab608a28f322"
            }

            assert user.auth "password"
        it 'write data',->
            user=config.create()
            user.setData {
                foo: "bar"
                baz: 10
            }

            user.writeData {
                hoge: "piyo"
            }

            assert.deepEqual user.getData(),{
                foo: "bar"
                baz: 10
                hoge: "piyo"
            }
        it 'write data doesn\'t change user version',->
            config.setSalt 1,->"salt1"
            config.setSalt 2,->"salt2"
            user=config.create()

            user.setData {
                foo: "bar"
            },"password",1


            assert.strictEqual user.version,1

            user.writeData {
                foo: "baz"
            }

            assert.deepEqual user.getData(),{
                foo: "baz"
            }
            assert.strictEqual user.version,1

