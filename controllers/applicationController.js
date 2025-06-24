const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


/*
Action	Route	HTTP Verb
Index	'/users/:userId/applications'	GET
New	'/users/:userId/applications/new'	GET
Create	'/users/:userId/applications'	POST
Show	'/users/:userId/applications/:applicationId'	GET
Edit	'/users/:userId/applications/:applicationId/edit'	GET
Update	'/users/:userId/applications/:applicationId'	PUT
Delete	'/users/:userId/applications/:applicationId'	DELETE
*/

// All routes below are mounted on /users/:userId/applications/

router.get('/', async (req, res) => {
    try {
        // get back the signed in user
        const currentUser = await User.findById(req.session.user._id)
    
        res.render('applications/index.ejs', {
            applications: currentUser.applications,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.get('/new', (req, res) => {
    res.render('applications/new.ejs')
})

router.post('/', async (req, res) => {

try {
    // Let's get back the signed in user
    const currentUser = await User.findById(req.session.user._id)

    // add application to users applications array
    currentUser.applications.push(req.body)
    // save the user to the DB
    await currentUser.save();

    // redirect to the applications index
    res.redirect(`/users/${currentUser._id}/applications`)
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.get('/:applicationId', async (req, res) => {
     try {
        // get back the signed in user
        const currentUser = await User.findById(req.session.user._id)
    
        // get back the specific application
        const application = currentUser.applications.id(req.params.applicationId)

        res.render('applications/show.ejs', {
            application: application,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.delete('/:applicationId', async (req, res) => {
     try {
        // get back the signed in user
        const currentUser = await User.findById(req.session.user._id)
    
        // get back the specific application
        const application = currentUser.applications.id(req.params.applicationId).deleteOne();
        await currentUser.save();

        res.redirect(`/users/${currentUser._id}/applications`);
        
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.get('/:applicationId/edit', async (req, res) => {
        const currentUser = await User.findById(req.session.user._id);
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/edit.ejs', {
            application: application,
    })
})

router.put('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const application = currentUser.applications.id(req.params.applicationId)

        // update the application using mongoose set method
        application.set(req.body)

        await currentUser.save()

        res.redirect(`/users/${currentUser._id}/applications/${application._id}`)


    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


module.exports = router;