const parseCSV = (text) => {
  const rows = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      rows.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    rows.push(row);
  }

  // Parse rows into questions
  const questions = [];
  if (rows.length <= 1) return questions;

  // Header inspection: find column indices
  // Expected headers: Type, Question Text, Points, Option A, Option B, Option C, Option D, Correct Answer
  const headers = rows[0].map(h => h.trim().toLowerCase());
  
  const colIndex = {
    type: headers.indexOf('type'),
    text: headers.indexOf('question text'),
    points: headers.indexOf('points'),
    optA: headers.indexOf('option a'),
    optB: headers.indexOf('option b'),
    optC: headers.indexOf('option c'),
    optD: headers.indexOf('option d'),
    correct: headers.indexOf('correct answer')
  };

  // Fallback if headers are not exact
  if (colIndex.type === -1) colIndex.type = 0;
  if (colIndex.text === -1) colIndex.text = 1;
  if (colIndex.points === -1) colIndex.points = 2;
  if (colIndex.optA === -1) colIndex.optA = 3;
  if (colIndex.optB === -1) colIndex.optB = 4;
  if (colIndex.optC === -1) colIndex.optC = 5;
  if (colIndex.optD === -1) colIndex.optD = 6;
  if (colIndex.correct === -1) colIndex.correct = 7;

  for (let r = 1; r < rows.length; r++) {
    const rowData = rows[r];
    if (rowData.length < 2 || !rowData.some(cell => cell.trim() !== "")) continue;

    const rawType = (rowData[colIndex.type] || '').trim().toUpperCase();
    let type = 'MCQ';
    if (['MCQ', 'MULTIPLE_SELECT', 'DESCRIPTIVE', 'CODING'].includes(rawType)) {
      type = rawType;
    } else if (rawType === 'MULTI-SELECT' || rawType === 'MULTI_SELECT') {
      type = 'MULTIPLE_SELECT';
    }

    const text = (rowData[colIndex.text] || '').trim();
    const points = parseInt((rowData[colIndex.points] || '5').trim(), 10) || 5;
    
    const options = [];
    if (type === 'MCQ' || type === 'MULTIPLE_SELECT') {
      options.push((rowData[colIndex.optA] || '').trim());
      options.push((rowData[colIndex.optB] || '').trim());
      options.push((rowData[colIndex.optC] || '').trim());
      options.push((rowData[colIndex.optD] || '').trim());
    }

    const rawCorrect = (rowData[colIndex.correct] || '').trim();

    questions.push({
      type,
      text,
      points,
      options,
      rawCorrect
    });
  }

  return questions;
};

const parseTXT = (text) => {
  const lines = text.split(/\r?\n/);
  const questions = [];
  let currentQuestion = null;
  let inOptions = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if starting a new question block
    // Matches "Question 1", "Q1", "Q:", etc.
    const questionMatch = line.match(/^(?:Question\s*\d+|Q\d+|Q\s*:)/i);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        type: 'MCQ',
        text: '',
        points: 5,
        options: [],
        rawCorrect: ''
      };
      inOptions = false;
      continue;
    }

    if (!currentQuestion) {
      currentQuestion = {
        type: 'MCQ',
        text: '',
        points: 5,
        options: [],
        rawCorrect: ''
      };
      inOptions = false;
    }

    if (line.toLowerCase().startsWith('type:')) {
      const typeVal = line.substring(5).trim().toUpperCase();
      if (['MCQ', 'MULTIPLE_SELECT', 'DESCRIPTIVE', 'CODING'].includes(typeVal)) {
        currentQuestion.type = typeVal;
      } else if (typeVal === 'MULTI-SELECT' || typeVal === 'MULTI_SELECT') {
        currentQuestion.type = 'MULTIPLE_SELECT';
      }
      inOptions = false;
    } else if (line.toLowerCase().startsWith('points:')) {
      const pointsVal = parseInt(line.substring(7).trim(), 10);
      if (!isNaN(pointsVal)) {
        currentQuestion.points = pointsVal;
      }
      inOptions = false;
    } else if (line.toLowerCase().startsWith('text:')) {
      currentQuestion.text = line.substring(5).trim();
      inOptions = false;
      // Read multi-line text
      while (i + 1 < lines.length && 
             !lines[i+1].trim().toLowerCase().startsWith('type:') &&
             !lines[i+1].trim().toLowerCase().startsWith('points:') &&
             !lines[i+1].trim().toLowerCase().startsWith('options:') &&
             !lines[i+1].trim().toLowerCase().startsWith('correct answer:') &&
             !lines[i+1].trim().toLowerCase().startsWith('correct:') &&
             !lines[i+1].match(/^(?:Question\s*\d+|Q\d+|Q\s*:)/i)) {
        i++;
        currentQuestion.text += '\n' + lines[i].trim();
      }
    } else if (line.toLowerCase().startsWith('options:')) {
      inOptions = true;
    } else if (line.toLowerCase().startsWith('correct answer:') || line.toLowerCase().startsWith('correct:')) {
      const prefixLen = line.toLowerCase().startsWith('correct answer:') ? 15 : 8;
      currentQuestion.rawCorrect = line.substring(prefixLen).trim();
      inOptions = false;
    } else if (inOptions && (line.startsWith('-') || line.startsWith('*') || /^[a-d\d]\)/i.test(line) || /^\d+\./.test(line))) {
      const optText = line.replace(/^(?:[-*]|\w+\)|\d+\.)\s*/, '').trim();
      currentQuestion.options.push(optText);
    } else {
      if (!inOptions && currentQuestion) {
        if (currentQuestion.text) {
          currentQuestion.text += '\n' + line;
        } else {
          currentQuestion.text = line;
        }
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
};

// Validates a single question and resolves its rawCorrect answer to the final correctAnswer format
const validateAndResolveQuestion = (q, index) => {
  const errors = [];
  let correctAnswer = q.type === 'MULTIPLE_SELECT' ? [] : '';

  if (!q.text || q.text.trim() === '') {
    errors.push('Question text is empty.');
  }

  if (typeof q.points !== 'number' || q.points <= 0) {
    errors.push('Points must be a positive number.');
  }

  if (q.type === 'MCQ' || q.type === 'MULTIPLE_SELECT') {
    // Check options count - must be exactly 4 options
    const filteredOptions = q.options ? q.options.filter(o => o !== undefined && o !== null) : [];
    
    // Ensure we have exactly 4 options
    while (filteredOptions.length < 4) {
      filteredOptions.push('');
    }
    q.options = filteredOptions.slice(0, 4);

    const emptyCount = q.options.filter(o => o.trim() === '').length;
    if (emptyCount > 0) {
      errors.push('All 4 options must be non-empty.');
    }

    const rawCorrect = q.rawCorrect ? q.rawCorrect.trim() : '';

    if (!rawCorrect) {
      errors.push('Correct answer is missing.');
    } else if (q.type === 'MCQ') {
      // 1. Prioritize exact text match
      const exactMatch = q.options.find(opt => opt.trim().toLowerCase() === rawCorrect.toLowerCase());
      
      if (exactMatch) {
        correctAnswer = exactMatch;
      } else {
        // 2. Fallback to index / letter
        const letterIndex = ['A', 'B', 'C', 'D'].indexOf(rawCorrect.toUpperCase());
        const numIndex = parseInt(rawCorrect, 10);
        
        if (letterIndex !== -1) {
          correctAnswer = q.options[letterIndex];
          if (!correctAnswer || correctAnswer.trim() === '') {
            errors.push(`Correct Option '${rawCorrect}' is empty.`);
          }
        } else if (!isNaN(numIndex) && numIndex >= 0 && numIndex < 4) {
          correctAnswer = q.options[numIndex];
          if (!correctAnswer || correctAnswer.trim() === '') {
            errors.push(`Correct Option '${numIndex}' is empty.`);
          }
        } else {
          errors.push(`Correct answer '${rawCorrect}' does not match any of the options.`);
          correctAnswer = rawCorrect; // keep raw as fallback
        }
      }
    } else {
      // MULTIPLE_SELECT
      // Split rawCorrect by separators like |, ;, or ,
      const rawAnsParts = rawCorrect.split(/[|;,]/).map(part => part.trim());
      const resolvedAnswers = [];

      for (const part of rawAnsParts) {
        // 1. Prioritize exact text match
        const exactMatch = q.options.find(opt => opt.trim().toLowerCase() === part.toLowerCase());
        
        if (exactMatch) {
          resolvedAnswers.push(exactMatch);
        } else {
          // 2. Fallback to index / letter
          const letterIndex = ['A', 'B', 'C', 'D'].indexOf(part.toUpperCase());
          const numIndex = parseInt(part, 10);

          if (letterIndex !== -1) {
            const optVal = q.options[letterIndex];
            if (optVal && optVal.trim() !== '') {
              resolvedAnswers.push(optVal);
            } else {
              errors.push(`Correct Option '${part}' is empty.`);
            }
          } else if (!isNaN(numIndex) && numIndex >= 0 && numIndex < 4) {
            const optVal = q.options[numIndex];
            if (optVal && optVal.trim() !== '') {
              resolvedAnswers.push(optVal);
            } else {
              errors.push(`Correct Option '${part}' is empty.`);
            }
          } else {
            errors.push(`Correct answer part '${part}' does not match any of the options.`);
          }
        }
      }

      correctAnswer = resolvedAnswers;
      if (resolvedAnswers.length === 0) {
        errors.push('No valid correct answers matched options.');
      }
    }
  } else {
    // DESCRIPTIVE or CODING
    q.options = [];
    correctAnswer = q.rawCorrect || '';
  }

  return {
    ...q,
    correctAnswer,
    validationErrors: errors
  };
};

module.exports = {
  parseCSV,
  parseTXT,
  validateAndResolveQuestion
};
