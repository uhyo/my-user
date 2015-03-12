assert=require 'assert'

user_object=require '../lib/user-object'

describe 'User object',->
    config=null
    beforeEach ->
        config=new user_object.UserConfig()

    it 'default user version',->
        user=config.create()
        user.setData {},"password"
        assert.strictEqual user.version,0

    it 'default authenticats',->
        user=config.create()
        user.setData {},"password"

        assert.strictEqual user.auth("foobar"),false,"wrong password"
        assert.strictEqual user.auth("password"),true,"correct password"

    it 'user versioning',->
        config.setSalt 1,16
        user=config.create()
        user.setData {},"foo"

        assert.strictEqual user.version,1

        #version up
        config.setPasswordHash 2,"md5"
        user2=config.create()
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
        user=config.create()

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
        user=config.create()

        user.setData {},"password"

        assert.strictEqual user.password,"saltpassword"

    it 'partial upgrading',->
        config.setSalt 1,->
            "salt"
        config.setPasswordHash 1,(salt,password)->
            salt+password

        user=config.create()
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
        
        user=config.create()
        user.setData {},"foo"

        config.setPasswordHash 2,(salt,password)->
            salt+password+password

        # upgrade user
        user.setData {foo:3},"bar"
        
        assert.strictEqual user.password,"saltbarbar"
