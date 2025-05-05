
import fs from 'fs'
import { utilService } from './util.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const TOY_DB_PATH = 'data/toy.json'
const PAGE_SIZE = 5

let toys = utilService.readJsonFile(TOY_DB_PATH)

function query(filterBy = {}) {
    let {
        txt = '',
        maxPrice = Infinity,
        inStockFilter = 'all',
        sortByLabel = [],
        sortBy = 'name',
        sortOrder = 1,
        pageIdx
    } = filterBy
   
    
    const regex = new RegExp(txt, 'i')
    let filteredToys = toys.filter(toy => regex.test(toy.name))

    filteredToys = filteredToys.filter(toy => toy.price <= maxPrice)

    if (inStockFilter === 'inStockFiltered') {
        filteredToys = filteredToys.filter(toy => toy.inStock)
    } else if (inStockFilter === 'outOfStock') {
        filteredToys = filteredToys.filter(toy => !toy.inStock)
    }

    if (sortByLabel?.length) {
        filteredToys = filteredToys.filter(toy =>
            Array.isArray(toy.labels) &&
            toy.labels.some(label => sortByLabel.includes(label))
        )
    }

    if (sortBy === 'name') {
        filteredToys.sort((a, b) => a.name.localeCompare(b.name) * sortOrder)
    } else if (sortBy === 'price') {
        filteredToys.sort((a, b) => (a.price - b.price) * sortOrder)
    } else if (sortBy === 'createdAt') {
        filteredToys.sort((a, b) => (a.createdAt - b.createdAt) * sortOrder)
    }

    // if (pageIdx !== undefined) {
    //     const startIdx = pageIdx * PAGE_SIZE
    //     filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
    // }
   

    return Promise.resolve(filteredToys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(curr => curr._id === toy._id)
        if (idx === -1) return Promise.reject('Toy not found')
        toys[idx] = { ...toys[idx], ...toy }
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        toys.push(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile(TOY_DB_PATH, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
