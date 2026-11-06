const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assignments`;

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'The assignment request failed.');
  }

  return data;
}

export async function getAssignments() {
  return readResponse(await fetch(API_URL));
}

export async function createAssignment(newAssignment) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAssignment)
  });

  return readResponse(response);
}

export async function submitAssignment(id) {
  const response = await fetch(`${API_URL}/${id}/submit`, {
    method: 'PUT'
  });

  return readResponse(response);
}

export async function undoSubmission(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'Pending' })
  });

  return readResponse(response);
}

export async function deleteAssignment(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  return readResponse(response);
}