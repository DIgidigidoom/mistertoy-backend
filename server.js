import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://localhost:3030',
        'http://localhost:5173',
        'http://127.0.0.1:3030',
        'http://127.0.0.1:5173'
    ],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// === REST API for Toys ===

// GET toys with filters
app.get('/api/toy', (req, res) => {
    toyService.query(req.query)
        .then(toys => res.json(toys))
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(500).json({ error: 'Cannot get toys' })
        })
})

// GET single toy
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then(toy => res.json(toy))
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(500).json({ error: 'Cannot get toy' })
        })
})

// POST new toy
app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        inStock: req.body.inStock,
        labels: req.body.labels || [],
        createdAt: Date.now()
    }

    toyService.save(toy)
        .then(savedToy => res.json(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(500).json({ error: 'Cannot save toy' })
        })
})

// PUT update toy
app.put('/api/toy/:id', (req, res) => {
    const toy = {
        _id: req.params.id,
        name: req.body.name,
        price: +req.body.price,
        inStock: req.body.inStock,
        labels: req.body.labels || [],
        createdAt: req.body.createdAt
    }

    toyService.save(toy)
        .then(savedToy => res.json(savedToy))
        .catch(err => {
            loggerService.error('Cannot update toy', err)
            res.status(500).json({ error: 'Cannot update toy' })
        })
})

// DELETE toy
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot remove toy', err)
            res.status(500).json({ error: 'Cannot remove toy' })
        })
})

// Fallback for SPA
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on http://127.0.0.1:${PORT}/`)
)


// User API
// app.get('/api/user', (req, res) => {
//     userService.query()
//         .then(users => res.send(users))
//         .catch(err => {
//             loggerService.error('Cannot load users', err)
//             res.status(400).send('Cannot load users')
//         })
// })



// app.get('/api/user/:userId', (req, res) => {
//     const { userId } = req.params

//     userService.getById(userId)
//         .then(user => res.send(user))
//         .catch(err => {
//             loggerService.error('Cannot load user', err)
//             res.status(400).send('Cannot load user')
//         })
// })

// // Auth API
// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body

//     userService.checkLogin(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(401).send('Invalid Credentials')
//             }
//         })
//         .catch(err => {
//             loggerService.error('Cannot login', err)
//             res.status(400).send('Cannot login')
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body

//     userService.save(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(400).send('Cannot signup')
//             }
//         })
//         .catch(err => {
//             loggerService.error('Cannot signup', err)
//             res.status(400).send('Cannot signup')
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })


// app.put('/api/user', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     if (!loggedinUser) return res.status(400).send('No logged in user')
//     const { diff } = req.body
//     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
//     loggedinUser.score += diff
//     return userService.save(loggedinUser)
//         .then(user => {
//             const token = userService.getLoginToken(user)
//             res.cookie('loginToken', token)
//             res.send(user)
//         })
//         .catch(err => {
//             loggerService.error('Cannot edit user', err)
//             res.status(400).send('Cannot edit user')
//         })
// })



