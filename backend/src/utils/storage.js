const fs = require('fs').promises;
const path = require('path');

const doubtsFilePath = path.join(__dirname, '../../data/doubts.json');
const messagesFilePath = path.join(__dirname, '../../data/messages.json');
const subjectsFilePath = path.join(__dirname, '../../data/subjects.json');
const teachersFilePath = path.join(__dirname, '../../data/teachers.json');

const readData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const writeData = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const getDoubts = () => readData(doubtsFilePath);
const saveDoubts = (data) => writeData(doubtsFilePath, data);

const getMessages = () => readData(messagesFilePath);
const saveMessages = (data) => writeData(messagesFilePath, data);

const getSubjects = () => readData(subjectsFilePath);
const getTeachers = () => readData(teachersFilePath);

module.exports = {
    getDoubts,
    saveDoubts,
    getMessages,
    saveMessages,
    getSubjects,
    getTeachers,
};
