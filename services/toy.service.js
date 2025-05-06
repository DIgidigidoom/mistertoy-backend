
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


async function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return toy
}


async function remove(toyId) {
    try {
        const idx = toys.findIndex(toy => toy._id === toyId)
        if (idx === -1) throw new Error('No Such Toy')
        toys.splice(idx, 1)
        await _saveToysToFile()
    } catch (err) {
        console.error('Failed to remove toy:', err)
        throw err
    }
}


async function save(toy) {
    try {
        if (toy._id) {
            const idx = toys.findIndex(curr => curr._id === toy._id)
            if (idx === -1) return new Error('Toy not found')
            toys[idx] = { ...toys[idx], ...toy }
        } else {
            toy._id = utilService.makeId()
            toy.createdAt = Date.now()
            toy.inStock = true
            toys.push(toy)
        }
        await _saveToysToFile()
        return toy

    } catch (err) {
        console.error('Failed to save toy:', err)
        throw err
    }
}


async function _saveToysToFile() {
    try {
        const data = JSON.stringify(toys, null, 2)
        await fs.promises.writeFile(TOY_DB_PATH, data)
    } catch (err) {
        console.log("Error saving toy: ", err)
    }
}