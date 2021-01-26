module.exports = func => { // func is the function we pass in
    return (req, res, next) => { // This returns a new function that has func executed
        func(req, res, next).catch(next); // then catches any errors and passes them to next()
    }
}