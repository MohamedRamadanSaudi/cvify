// API Base URL
const API_BASE = '/api';

// State
let currentView = 'profiles';
let currentProfile = null;
let profiles = [];

// DOM Elements
const views = {
  profiles: document.getElementById('profilesView'),
  createProfile: document.getElementById('createProfileView'),
  profileDetail: document.getElementById('profileDetailView'),
  editProfile: document.getElementById('editProfileView'),
  generateCv: document.getElementById('generateCvView'),
  history: document.getElementById('historyView'),
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadProfiles();
});

// Event Listeners
function initializeEventListeners() {
  // Navigation
  document
    .getElementById('createProfileBtn')
    .addEventListener('click', () => showView('createProfile'));
  document
    .getElementById('backFromCreateBtn')
    .addEventListener('click', () => showView('profiles'));
  document
    .getElementById('backFromDetailBtn')
    .addEventListener('click', () => showView('profiles'));
  document
    .getElementById('backFromGenerateBtn')
    .addEventListener('click', () => showView('profileDetail'));
  document
    .getElementById('backFromHistoryBtn')
    .addEventListener('click', () => showView('profileDetail'));
  document
    .getElementById('backFromEditBtn')
    .addEventListener('click', () => showView('profileDetail'));

  // Forms
  document
    .getElementById('createProfileForm')
    .addEventListener('submit', handleCreateProfile);
  document
    .getElementById('generateCvForm')
    .addEventListener('submit', handleGenerateCv);
  document
    .getElementById('editProfileForm')
    .addEventListener('submit', handleUpdateProfile);

  // Profile Detail Actions
  document
    .getElementById('editProfileBtn')
    .addEventListener('click', loadEditProfile);
  document.getElementById('generateCvBtn').addEventListener('click', () => {
    loadProfilesForSelect();
    showView('generateCv');
  });
  document
    .getElementById('viewHistoryBtn')
    .addEventListener('click', loadHistory);
  document
    .getElementById('deleteProfileBtn')
    .addEventListener('click', handleDeleteCurrentProfile);
}

// View Management
function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.remove('active'));
  views[viewName].classList.add('active');
  currentView = viewName;
}

// API Calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Request failed');
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Load Profiles
async function loadProfiles() {
  showLoading(true);
  try {
    profiles = await apiCall('/profiles');
    renderProfiles();
  } catch (error) {
    showToast('Failed to load profiles', 'error');
  } finally {
    showLoading(false);
  }
}

// Render Profiles
function renderProfiles() {
  const container = document.getElementById('profilesList');

  if (profiles.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No profiles yet. Create your first profile to get started!</p>
            </div>
        `;
    return;
  }

  container.innerHTML = profiles
    .map(
      (profile) => `
        <div class="profile-card" onclick="viewProfile(${profile.id})">
            <button class="delete-btn" onclick="event.stopPropagation(); deleteProfile(${profile.id})" title="Delete profile">
                🗑️
            </button>
            <h3>${escapeHtml(profile.profileName)}</h3>
            <p class="profile-email">${escapeHtml(profile.email)}</p>
            <div class="profile-card-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); viewProfile(${profile.id})">
                    View Details
                </button>
            </div>
        </div>
    `,
    )
    .join('');
}

// View Profile
window.viewProfile = async function (profileId) {
  showLoading(true);
  try {
    const profile = await apiCall(`/profiles/${profileId}`);
    currentProfile = profile;

    document.getElementById('profileDetailName').textContent =
      profile.profileName;
    document.getElementById('profileDetailEmail').textContent = profile.email;

    showView('profileDetail');
  } catch (error) {
    showToast('Failed to load profile details', 'error');
  } finally {
    showLoading(false);
  }
};

// Create Profile
async function handleCreateProfile(e) {
  e.preventDefault();
  showLoading(true);

  const formData = new FormData(e.target);
  const data = {
    profileName: formData.get('profileName'),
    email: formData.get('email'),
  };

  try {
    await apiCall('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    showToast('Profile created successfully!', 'success');
    e.target.reset();
    await loadProfiles();
    showView('profiles');
  } catch (error) {
    showToast(error.message || 'Failed to create profile', 'error');
  } finally {
    showLoading(false);
  }
}

// Delete Profile
window.deleteProfile = async function (profileId) {
  if (
    !confirm(
      'Are you sure you want to delete this profile? This action cannot be undone.',
    )
  ) {
    return;
  }

  showLoading(true);
  try {
    await apiCall(`/profiles/${profileId}`, { method: 'DELETE' });
    showToast('Profile deleted successfully', 'success');
    await loadProfiles();
  } catch (error) {
    showToast('Failed to delete profile', 'error');
  } finally {
    showLoading(false);
  }
};

// Delete Current Profile
async function handleDeleteCurrentProfile() {
  if (!currentProfile) return;

  if (
    !confirm(
      `Are you sure you want to delete "${currentProfile.profileName}"? This action cannot be undone.`,
    )
  ) {
    return;
  }

  showLoading(true);
  try {
    await apiCall(`/profiles/${currentProfile.id}`, { method: 'DELETE' });
    showToast('Profile deleted successfully', 'success');
    currentProfile = null;
    await loadProfiles();
    showView('profiles');
  } catch (error) {
    showToast('Failed to delete profile', 'error');
  } finally {
    showLoading(false);
  }
}

// Load Profiles for Select
async function loadProfilesForSelect() {
  const select = document.getElementById('selectProfile');

  if (profiles.length === 0) {
    await loadProfiles();
  }

  select.innerHTML =
    '<option value="">Choose a profile...</option>' +
    profiles
      .map(
        (p) => `<option value="${p.id}">${escapeHtml(p.profileName)}</option>`,
      )
      .join('');

  // Pre-select current profile if available
  if (currentProfile) {
    select.value = currentProfile.id;
  }
}

// Generate CV
async function handleGenerateCv(e) {
  e.preventDefault();
  showLoading(true);

  const formData = new FormData(e.target);
  const data = {
    profileId: parseInt(formData.get('profileId')),
    jobDescription: formData.get('jobDescription'),
  };

  try {
    const response = await fetch('/cvs/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate CV');
    }

    // Download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('CV generated successfully!', 'success');
    e.target.reset();
    showView('profiles');
  } catch (error) {
    showToast(error.message || 'Failed to generate CV', 'error');
  } finally {
    showLoading(false);
  }
}

// Load History
async function loadHistory() {
  if (!currentProfile) return;

  showLoading(true);
  try {
    const cvs = await apiCall(`/cvs/profile/${currentProfile.id}`);

    document.getElementById('historyProfileName').textContent =
      `History for ${currentProfile.profileName}`;

    renderHistory(cvs);
    showView('history');
  } catch (error) {
    showToast('Failed to load history', 'error');
  } finally {
    showLoading(false);
  }
}

// Render History
function renderHistory(cvs) {
  const container = document.getElementById('historyList');

  if (cvs.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <p>No CVs generated yet for this profile.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = cvs
    .map((cv) => {
      const description = escapeHtml(
        cv.jobDescription || 'No description available',
      );
      const needsExpand = description.length > 200;
      return `
    <div class="history-item">
      <div class="history-item-header">
        <div class="history-item-id">CV #${cv.id}</div>
        <div class="history-item-date">${formatDate(cv.createdAt)}</div>
      </div>
      <div class="history-item-description-wrapper">
        <div class="history-item-description ${needsExpand ? 'expandable' : ''}" id="desc-${cv.id}">
          ${needsExpand ? description.substring(0, 200) + '...' : description}
        </div>
        ${needsExpand ? `<button class="btn-see-more" onclick="toggleDescription(${cv.id}, \`${description.replace(/`/g, '\`')}\`)" id="btn-desc-${cv.id}">See more</button>` : ''}
      </div>
      <div class="history-item-actions">
        <button class="btn btn-primary" onclick="downloadCv(${cv.id})">
          Download PDF
        </button>
        <button class="btn btn-secondary" onclick="openRegenerateModal(${cv.id})">
          Regenerate
        </button>
        <button class="btn btn-danger" onclick="deleteCv(${cv.id})">
          Delete
        </button>
      </div>
    </div>
    `;
    })
    .join('');
}

// Toggle Job Description
window.toggleDescription = function (cvId, fullDescription) {
  const descElement = document.getElementById(`desc-${cvId}`);
  const button = document.getElementById(`btn-desc-${cvId}`);
  if (descElement.classList.contains('expanded')) {
    descElement.classList.remove('expanded');
    descElement.innerHTML = fullDescription.substring(0, 200) + '...';
    button.textContent = 'See more';
  } else {
    descElement.classList.add('expanded');
    descElement.innerHTML = fullDescription;
    button.textContent = 'See less';
  }
};

// Open Regenerate Modal
window.openRegenerateModal = async function (cvId) {
  showLoading(true);
  try {
    const cv = await apiCall(`/cvs/${cvId}`);

    if (!cv.cvData) {
      showToast('No CV data available to edit', 'error');
      return;
    }

    // Show modal with JSON editor
    const modal = document.getElementById('regenerateModal');
    const textarea = document.getElementById('cvJsonData');
    const saveBtn = document.getElementById('saveCvDataBtn');

    textarea.value = JSON.stringify(cv.cvData, null, 2);
    modal.classList.add('show');

    // Store cvId for save operation
    saveBtn.onclick = () => saveCvData(cvId);
  } catch (error) {
    showToast('Failed to load CV data', 'error');
  } finally {
    showLoading(false);
  }
};

// Close Regenerate Modal
window.closeRegenerateModal = function () {
  const modal = document.getElementById('regenerateModal');
  modal.classList.remove('show');
};

// Save CV Data
async function saveCvData(cvId) {
  const textarea = document.getElementById('cvJsonData');

  try {
    // Validate JSON
    const cvData = JSON.parse(textarea.value);

    showLoading(true);

    // Update CV data
    await apiCall(`/cvs/${cvId}/cv-data`, {
      method: 'PATCH',
      body: JSON.stringify(cvData),
    });

    showToast('CV data updated successfully!', 'success');
    closeRegenerateModal();

    // Download the regenerated PDF
    await downloadCv(cvId);
  } catch (error) {
    if (error instanceof SyntaxError) {
      showToast('Invalid JSON format. Please check your syntax.', 'error');
    } else {
      showToast('Failed to update CV data', 'error');
    }
  } finally {
    showLoading(false);
  }
}

// View Job Description (keeping for backwards compatibility but not used)
window.viewJobDescription = function (cvId, description) {
  alert('Job Description:\n\n' + description);
};

// Download CV
window.downloadCv = async function (cvId) {
  showLoading(true);
  try {
    const response = await fetch(`/cvs/${cvId}/download`);

    if (!response.ok) {
      throw new Error('Failed to download CV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${cvId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('CV downloaded successfully!', 'success');
  } catch (error) {
    showToast('Failed to download CV', 'error');
  } finally {
    showLoading(false);
  }
};

// Regenerate CV
window.regenerateCv = async function (cvId) {
  showLoading(true);
  try {
    const response = await fetch(`/cvs/${cvId}/regenerate`);

    if (!response.ok) {
      throw new Error('Failed to regenerate CV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${cvId}-regenerated.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('CV regenerated successfully!', 'success');
  } catch (error) {
    showToast('Failed to regenerate CV', 'error');
  } finally {
    showLoading(false);
  }
};

// Delete CV
window.deleteCv = async function (cvId) {
  if (!confirm('Are you sure you want to delete this CV?')) {
    return;
  }

  showLoading(true);
  try {
    await apiCall(`/cvs/${cvId}`, { method: 'DELETE' });
    showToast('CV deleted successfully', 'success');
    await loadHistory();
  } catch (error) {
    showToast('Failed to delete CV', 'error');
  } finally {
    showLoading(false);
  }
};

// Utility Functions
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============= PROFILE EDITING FUNCTIONS =============

// Load Edit Profile View
async function loadEditProfile() {
  if (!currentProfile) return;

  showLoading(true);
  try {
    const profile = await apiCall(`/profiles/${currentProfile.id}`);
    populateEditForm(profile);
    showView('editProfile');
  } catch (error) {
    showToast('Failed to load profile data', 'error');
  } finally {
    showLoading(false);
  }
}

// Populate Edit Form
function populateEditForm(profile) {
  // Basic Information
  document.getElementById('fullName').value = profile.fullName || '';
  document.getElementById('title').value = profile.title || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('location').value = profile.location || '';
  document.getElementById('summary').value = profile.summary || '';
  document.getElementById('skills').value = profile.skills?.join(', ') || '';

  // Clear and populate dynamic sections
  populateLinks(profile.links || []);
  populateExperiences(profile.experiences || []);
  populateEducation(profile.education || []);
  populateProjects(profile.projects || []);
  populateVolunteering(profile.volunteering || []);
  populateActivities(profile.activities || []);
}

// Handle Update Profile
async function handleUpdateProfile(e) {
  e.preventDefault();
  if (!currentProfile) return;

  showLoading(true);
  try {
    const formData = collectFormData();

    await apiCall(`/profiles/${currentProfile.id}`, {
      method: 'PATCH',
      body: JSON.stringify(formData),
    });

    showToast('Profile updated successfully!', 'success');
    await viewProfile(currentProfile.id);
  } catch (error) {
    showToast(error.message || 'Failed to update profile', 'error');
  } finally {
    showLoading(false);
  }
}

// Collect Form Data
function collectFormData() {
  const formData = {
    fullName: document.getElementById('fullName').value,
    title: document.getElementById('title').value,
    phone: document.getElementById('phone').value,
    location: document.getElementById('location').value,
    summary: document.getElementById('summary').value,
    skills: document
      .getElementById('skills')
      .value.split(',')
      .map((s) => s.trim())
      .filter((s) => s),
    links: collectLinks(),
    experiences: collectExperiences(),
    education: collectEducation(),
    projects: collectProjects(),
    volunteering: collectVolunteering(),
    activities: collectActivities(),
  };

  return formData;
}

// ============= SECTION SWITCHING =============

window.switchSection = function (sectionName) {
  // Update tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab) => tab.classList.remove('active'));
  event.target.classList.add('active');

  // Update sections
  const sections = document.querySelectorAll('.section-content');
  sections.forEach((section) => section.classList.remove('active'));
  document
    .querySelector(`[data-section="${sectionName}"]`)
    .classList.add('active');
};

// ============= LINKS =============

window.addLink = function () {
  const container = document.getElementById('linksContainer');
  const index = container.children.length;
  const html = `
    <div class="form-item" data-index="${index}">
      <div class="form-item-header">
        <span class="form-item-title">Link ${index + 1}</span>
        <button type="button" class="btn-remove" onclick="removeItem(this)">🗑️</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Type</label>
          <input type="text" name="link-type-${index}" placeholder="LinkedIn, GitHub, Portfolio, etc.">
        </div>
        <div class="form-group">
          <label>URL</label>
          <input type="url" name="link-url-${index}" placeholder="https://...">
        </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  // Scroll to the newly added item
  setTimeout(() => {
    const newItem = container.lastElementChild;
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    newItem.querySelector('input').focus();
  }, 100);
};

function populateLinks(links) {
  const container = document.getElementById('linksContainer');
  container.innerHTML = '';
  links.forEach((link, index) => {
    globalThis.addLink();
    const item = container.lastElementChild;
    item.querySelector(`input[name="link-type-${index}"]`).value =
      link.type || '';
    item.querySelector(`input[name="link-url-${index}"]`).value =
      link.url || '';
  });
}

function collectLinks() {
  const container = document.getElementById('linksContainer');
  const links = [];
  for (const item of container.children) {
    const index = item.dataset.index;
    const type = item.querySelector(`input[name="link-type-${index}"]`)?.value;
    const url = item.querySelector(`input[name="link-url-${index}"]`)?.value;
    if (url) {
      links.push({ type, url });
    }
  }
  return links;
}

// ============= EXPERIENCES =============

window.addExperienceLink = function (expIndex) {
  const container = document.getElementById(`exp-links-${expIndex}`);
  const linkIndex = container.children.length;
  const html = `
    <div class="nested-item" data-link-index="${linkIndex}">
      <div class="form-row">
        <div class="form-group">
          <input type="text" name="exp-${expIndex}-link-type-${linkIndex}" placeholder="e.g., Company Website, LinkedIn Post">
        </div>
        <div class="form-group">
          <input type="url" name="exp-${expIndex}-link-url-${linkIndex}" placeholder="https://example.com">
        </div>
        <button type="button" class="btn-remove" onclick="removeItem(this.parentElement.parentElement)" title="Remove link">🗑️</button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
};

window.addExperience = function () {
  const container = document.getElementById('experiencesContainer');
  const index = container.children.length;
  const html = `
    <div class="form-item" data-index="${index}">
      <div class="form-item-header">
        <span class="form-item-title">Experience ${index + 1}</span>
        <button type="button" class="btn-remove" onclick="removeItem(this)">🗑️</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" name="exp-jobTitle-${index}" placeholder="Senior Software Engineer">
        </div>
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" name="exp-companyName-${index}" placeholder="Google">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Employment Type</label>
          <input type="text" name="exp-employmentType-${index}" placeholder="Full-time">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" name="exp-location-${index}" placeholder="Mountain View, CA">
        </div>
      </div>
      <div class="form-group">
        <label>Links</label>
        <div id="exp-links-${index}" class="nested-items">
          <!-- Experience links will be added here -->
        </div>
        <button type="button" class="btn-add" onclick="addExperienceLink(${index})">+ Add Link</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" name="exp-startDate-${index}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" name="exp-endDate-${index}" id="exp-endDate-${index}">
        </div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="exp-current-${index}" name="exp-currentlyWorking-${index}" onchange="toggleEndDate(this, 'exp-endDate-${index}')">
        <label for="exp-current-${index}">Currently working here</label>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="exp-description-${index}" rows="4" placeholder="Describe your responsibilities and achievements..."></textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  // Scroll to the newly added item
  setTimeout(() => {
    const newItem = container.lastElementChild;
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    newItem.querySelector('input').focus();
  }, 100);
};

function populateExperiences(experiences) {
  const container = document.getElementById('experiencesContainer');
  container.innerHTML = '';
  experiences.forEach((exp, index) => {
    globalThis.addExperience();
    const item = container.lastElementChild;
    item.querySelector(`input[name="exp-jobTitle-${index}"]`).value =
      exp.jobTitle || '';
    item.querySelector(`input[name="exp-companyName-${index}"]`).value =
      exp.companyName || '';
    item.querySelector(`input[name="exp-employmentType-${index}"]`).value =
      exp.employmentType || '';
    item.querySelector(`input[name="exp-location-${index}"]`).value =
      exp.location || '';

    // Populate links
    if (exp.links && exp.links.length > 0) {
      exp.links.forEach((link) => {
        globalThis.addExperienceLink(index);
        const linksContainer = item.querySelector(`#exp-links-${index}`);
        const lastLink = linksContainer.lastElementChild;
        const linkIndex = lastLink.dataset.linkIndex;
        lastLink.querySelector(
          `input[name="exp-${index}-link-type-${linkIndex}"]`,
        ).value = link.type || '';
        lastLink.querySelector(
          `input[name="exp-${index}-link-url-${linkIndex}"]`,
        ).value = link.url || '';
      });
    }

    item.querySelector(`input[name="exp-startDate-${index}"]`).value =
      exp.startDate || '';
    item.querySelector(`input[name="exp-endDate-${index}"]`).value =
      exp.endDate || '';
    const currentCheckbox = item.querySelector(
      `input[name="exp-currentlyWorking-${index}"]`,
    );
    currentCheckbox.checked = exp.currentlyWorking || false;
    // Disable end date if currently working
    if (currentCheckbox.checked) {
      item.querySelector(`#exp-endDate-${index}`).disabled = true;
    }
    item.querySelector(`textarea[name="exp-description-${index}"]`).value =
      exp.description || '';
  });
}

function collectExperiences() {
  const container = document.getElementById('experiencesContainer');
  const experiences = [];
  for (const item of container.children) {
    const index = item.dataset.index;
    const jobTitle = item.querySelector(
      `input[name="exp-jobTitle-${index}"]`,
    )?.value;
    const companyName = item.querySelector(
      `input[name="exp-companyName-${index}"]`,
    )?.value;
    if (jobTitle || companyName) {
      // Collect experience links
      const links = [];
      const linksContainer = item.querySelector(`#exp-links-${index}`);
      if (linksContainer) {
        for (const linkItem of linksContainer.children) {
          const linkIndex = linkItem.dataset.linkIndex;
          const linkType = linkItem.querySelector(
            `input[name="exp-${index}-link-type-${linkIndex}"]`,
          )?.value;
          const linkUrl = linkItem.querySelector(
            `input[name="exp-${index}-link-url-${linkIndex}"]`,
          )?.value;
          if (linkType && linkUrl) {
            links.push({ type: linkType, url: linkUrl });
          }
        }
      }

      experiences.push({
        jobTitle,
        companyName,
        employmentType: item.querySelector(
          `input[name="exp-employmentType-${index}"]`,
        )?.value,
        location: item.querySelector(`input[name="exp-location-${index}"]`)
          ?.value,
        links: links.length > 0 ? links : undefined,
        startDate: item.querySelector(`input[name="exp-startDate-${index}"]`)
          ?.value,
        endDate: item.querySelector(`input[name="exp-endDate-${index}"]`)
          ?.value,
        currentlyWorking: item.querySelector(
          `input[name="exp-currentlyWorking-${index}"]`,
        )?.checked,
        description: item.querySelector(
          `textarea[name="exp-description-${index}"]`,
        )?.value,
      });
    }
  }
  return experiences;
}

// ============= EDUCATION =============

window.addEducation = function () {
  const container = document.getElementById('educationContainer');
  const index = container.children.length;
  const html = `
    <div class="form-item" data-index="${index}">
      <div class="form-item-header">
        <span class="form-item-title">Education ${index + 1}</span>
        <button type="button" class="btn-remove" onclick="removeItem(this)">🗑️</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>School Name</label>
          <input type="text" name="edu-schoolName-${index}" placeholder="Stanford University">
        </div>
        <div class="form-group">
          <label>Degree</label>
          <input type="text" name="edu-degree-${index}" placeholder="Bachelor of Science">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Field of Study</label>
          <input type="text" name="edu-fieldOfStudy-${index}" placeholder="Computer Science">
        </div>
        <div class="form-group">
          <label>Grade</label>
          <input type="text" name="edu-grade-${index}" placeholder="3.8 GPA">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" name="edu-startDate-${index}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" name="edu-endDate-${index}" id="edu-endDate-${index}">
        </div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="edu-current-${index}" name="edu-currentlyStudying-${index}" onchange="toggleEndDate(this, 'edu-endDate-${index}')">
        <label for="edu-current-${index}">Currently studying</label>
      </div>
      <div class="form-group">
        <label>Location</label>
        <input type="text" name="edu-location-${index}" placeholder="Stanford, CA">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="edu-description-${index}" rows="3" placeholder="Additional information..."></textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  // Scroll to the newly added item
  setTimeout(() => {
    const newItem = container.lastElementChild;
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    newItem.querySelector('input').focus();
  }, 100);
};

function populateEducation(education) {
  const container = document.getElementById('educationContainer');
  container.innerHTML = '';
  education.forEach((edu, index) => {
    globalThis.addEducation();
    const item = container.lastElementChild;
    item.querySelector(`input[name="edu-schoolName-${index}"]`).value =
      edu.schoolName || '';
    item.querySelector(`input[name="edu-degree-${index}"]`).value =
      edu.degree || '';
    item.querySelector(`input[name="edu-fieldOfStudy-${index}"]`).value =
      edu.fieldOfStudy || '';
    item.querySelector(`input[name="edu-grade-${index}"]`).value =
      edu.grade || '';
    item.querySelector(`input[name="edu-startDate-${index}"]`).value =
      edu.startDate || '';
    item.querySelector(`input[name="edu-endDate-${index}"]`).value =
      edu.endDate || '';
    const currentCheckbox = item.querySelector(
      `input[name="edu-currentlyStudying-${index}"]`,
    );
    currentCheckbox.checked = edu.currentlyStudying || false;
    // Disable end date if currently studying
    if (currentCheckbox.checked) {
      item.querySelector(`#edu-endDate-${index}`).disabled = true;
    }
    item.querySelector(`input[name="edu-location-${index}"]`).value =
      edu.location || '';
    item.querySelector(`textarea[name="edu-description-${index}"]`).value =
      edu.description || '';
  });
}

function collectEducation() {
  const container = document.getElementById('educationContainer');
  const education = [];
  for (const item of container.children) {
    const index = item.dataset.index;
    const schoolName = item.querySelector(
      `input[name="edu-schoolName-${index}"]`,
    )?.value;
    if (schoolName) {
      education.push({
        schoolName,
        degree: item.querySelector(`input[name="edu-degree-${index}"]`)?.value,
        fieldOfStudy: item.querySelector(
          `input[name="edu-fieldOfStudy-${index}"]`,
        )?.value,
        grade: item.querySelector(`input[name="edu-grade-${index}"]`)?.value,
        startDate: item.querySelector(`input[name="edu-startDate-${index}"]`)
          ?.value,
        endDate: item.querySelector(`input[name="edu-endDate-${index}"]`)
          ?.value,
        currentlyStudying: item.querySelector(
          `input[name="edu-currentlyStudying-${index}"]`,
        )?.checked,
        location: item.querySelector(`input[name="edu-location-${index}"]`)
          ?.value,
        description: item.querySelector(
          `textarea[name="edu-description-${index}"]`,
        )?.value,
      });
    }
  }
  return education;
}

// ============= PROJECTS =============

window.addProjectLink = function (projectIndex) {
  const container = document.getElementById(`proj-links-${projectIndex}`);
  const linkIndex = container.children.length;
  const html = `
    <div class="nested-item" data-link-index="${linkIndex}">
      <div class="form-row">
        <div class="form-group">
          <input type="text" name="proj-${projectIndex}-link-type-${linkIndex}" placeholder="e.g., GitHub, Live Demo, Documentation">
        </div>
        <div class="form-group">
          <input type="url" name="proj-${projectIndex}-link-url-${linkIndex}" placeholder="https://example.com">
        </div>
        <button type="button" class="btn-remove" onclick="removeItem(this.parentElement.parentElement)" title="Remove link">🗑️</button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
};

window.addProject = function () {
  const container = document.getElementById('projectsContainer');
  const index = container.children.length;
  const html = `
    <div class="form-item" data-index="${index}">
      <div class="form-item-header">
        <span class="form-item-title">Project ${index + 1}</span>
        <button type="button" class="btn-remove" onclick="removeItem(this)">🗑️</button>
      </div>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" name="proj-title-${index}" placeholder="E-commerce Platform">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="proj-description-${index}" rows="3" placeholder="Describe the project..."></textarea>
      </div>
      <div class="form-group">
        <label>Technologies (comma-separated)</label>
        <input type="text" name="proj-technologies-${index}" placeholder="React, Node.js, MongoDB">
      </div>
      <div class="form-group">
        <label>Links</label>
        <div id="proj-links-${index}" class="nested-items">
          <!-- Project links will be added here -->
        </div>
        <button type="button" class="btn-add" onclick="addProjectLink(${index})">+ Add Link</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" name="proj-startDate-${index}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" name="proj-endDate-${index}" id="proj-endDate-${index}">
        </div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="proj-current-${index}" name="proj-currentlyOngoing-${index}" onchange="toggleEndDate(this, 'proj-endDate-${index}')">
        <label for="proj-current-${index}">Currently ongoing</label>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  // Scroll to the newly added item
  setTimeout(() => {
    const newItem = container.lastElementChild;
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    newItem.querySelector('input').focus();
  }, 100);
};

function populateProjects(projects) {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '';
  projects.forEach((proj, index) => {
    globalThis.addProject();
    const item = container.lastElementChild;
    item.querySelector(`input[name="proj-title-${index}"]`).value =
      proj.title || '';
    item.querySelector(`textarea[name="proj-description-${index}"]`).value =
      proj.description || '';
    item.querySelector(`input[name="proj-technologies-${index}"]`).value =
      proj.technologies?.join(', ') || '';

    // Populate links
    if (proj.links && proj.links.length > 0) {
      proj.links.forEach((link) => {
        globalThis.addProjectLink(index);
        const linksContainer = item.querySelector(`#proj-links-${index}`);
        const lastLink = linksContainer.lastElementChild;
        const linkIndex = lastLink.dataset.linkIndex;
        lastLink.querySelector(
          `input[name="proj-${index}-link-type-${linkIndex}"]`,
        ).value = link.type || '';
        lastLink.querySelector(
          `input[name="proj-${index}-link-url-${linkIndex}"]`,
        ).value = link.url || '';
      });
    }

    item.querySelector(`input[name="proj-startDate-${index}"]`).value =
      proj.startDate || '';
    item.querySelector(`input[name="proj-endDate-${index}"]`).value =
      proj.endDate || '';
    const currentCheckbox = item.querySelector(
      `input[name="proj-currentlyOngoing-${index}"]`,
    );
    currentCheckbox.checked = proj.currentlyOngoing || false;
    // Disable end date if currently ongoing
    if (currentCheckbox.checked) {
      item.querySelector(`#proj-endDate-${index}`).disabled = true;
    }
  });
}

function collectProjects() {
  const container = document.getElementById('projectsContainer');
  const projects = [];
  for (const item of container.children) {
    const index = item.dataset.index;
    const title = item.querySelector(
      `input[name="proj-title-${index}"]`,
    )?.value;
    if (title) {
      const techStr =
        item.querySelector(`input[name="proj-technologies-${index}"]`)?.value ||
        '';

      // Collect project links
      const links = [];
      const linksContainer = item.querySelector(`#proj-links-${index}`);
      if (linksContainer) {
        for (const linkItem of linksContainer.children) {
          const linkIndex = linkItem.dataset.linkIndex;
          const linkType = linkItem.querySelector(
            `input[name="proj-${index}-link-type-${linkIndex}"]`,
          )?.value;
          const linkUrl = linkItem.querySelector(
            `input[name="proj-${index}-link-url-${linkIndex}"]`,
          )?.value;
          if (linkType && linkUrl) {
            links.push({ type: linkType, url: linkUrl });
          }
        }
      }

      projects.push({
        title,
        description: item.querySelector(
          `textarea[name="proj-description-${index}"]`,
        )?.value,
        technologies: techStr
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
        links: links.length > 0 ? links : undefined,
        startDate: item.querySelector(`input[name="proj-startDate-${index}"]`)
          ?.value,
        endDate: item.querySelector(`input[name="proj-endDate-${index}"]`)
          ?.value,
        currentlyOngoing: item.querySelector(
          `input[name="proj-currentlyOngoing-${index}"]`,
        )?.checked,
      });
    }
  }
  return projects;
}

// ============= VOLUNTEERING =============

window.addVolunteering = function () {
  const container = document.getElementById('volunteeringContainer');
  const index = container.children.length;
  const html = `
    <div class="form-item" data-index="${index}">
      <div class="form-item-header">
        <span class="form-item-title">Volunteering ${index + 1}</span>
        <button type="button" class="btn-remove" onclick="removeItem(this)">🗑️</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Organization Name</label>
          <input type="text" name="vol-organizationName-${index}" placeholder="Red Cross">
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="text" name="vol-role-${index}" placeholder="Volunteer Coordinator">
        </div>
      </div>
      <div class="form-group">
        <label>Location</label>
        <input type="text" name="vol-location-${index}" placeholder="San Francisco, CA">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" name="vol-startDate-${index}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" name="vol-endDate-${index}" id="vol-endDate-${index}">
        </div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="vol-current-${index}" name="vol-currentlyVolunteering-${index}" onchange="toggleEndDate(this, 'vol-endDate-${index}')">
        <label for="vol-current-${index}">Currently volunteering</label>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="vol-description-${index}" rows="3" placeholder="Describe your role..."></textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  // Scroll to the newly added item
  setTimeout(() => {
    const newItem = container.lastElementChild;
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    newItem.querySelector('input').focus();
  }, 100);
};

function populateVolunteering(volunteering) {
  const container = document.getElementById('volunteeringContainer');
  container.innerHTML = '';
  volunteering.forEach((vol, index) => {
    globalThis.addVolunteering();
    const item = container.lastElementChild;
    item.querySelector(`input[name="vol-organizationName-${index}"]`).value =
      vol.organizationName || '';
    item.querySelector(`input[name="vol-role-${index}"]`).value =
      vol.role || '';
    item.querySelector(`input[name="vol-location-${index}"]`).value =
      vol.location || '';
    item.querySelector(`input[name="vol-startDate-${index}"]`).value =
      vol.startDate || '';
    item.querySelector(`input[name="vol-endDate-${index}"]`).value =
      vol.endDate || '';
    const currentCheckbox = item.querySelector(
      `input[name="vol-currentlyVolunteering-${index}"]`,
    );
    currentCheckbox.checked = vol.currentlyVolunteering || false;
    // Disable end date if currently volunteering
    if (currentCheckbox.checked) {
      item.querySelector(`#vol-endDate-${index}`).disabled = true;
    }
    item.querySelector(`textarea[name="vol-description-${index}"]`).value =
      vol.description || '';
  });
}

function collectVolunteering() {
  const container = document.getElementById('volunteeringContainer');
  const volunteering = [];
  for (const item of container.children) {
    const index = item.dataset.index;
    const organizationName = item.querySelector(
      `input[name="vol-organizationName-${index}"]`,
    )?.value;
    if (organizationName) {
      volunteering.push({
        organizationName,
        role: item.querySelector(`input[name="vol-role-${index}"]`)?.value,
        location: item.querySelector(`input[name="vol-location-${index}"]`)
          ?.value,
        startDate: item.querySelector(`input[name="vol-startDate-${index}"]`)
          ?.value,
        endDate: item.querySelector(`input[name="vol-endDate-${index}"]`)
          ?.value,
        currentlyVolunteering: item.querySelector(
          `input[name="vol-currentlyVolunteering-${index}"]`,
        )?.checked,
        description: item.querySelector(
          `textarea[name="vol-description-${index}"]`,
        )?.value,
      });
    }
  }
  return volunteering;
}

// ============= ACTIVITIES =============

window.addActivity = function () {
  const container = document.getElementById('activitiesContainer');
  const index = container.children.length;
  const html = `
    <div class="form-item" data-index="${index}">
      <div class="form-item-header">
        <span class="form-item-title">Activity ${index + 1}</span>
        <button type="button" class="btn-remove" onclick="removeItem(this)">🗑️</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="act-title-${index}" placeholder="President of Robotics Club">
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="text" name="act-role-${index}" placeholder="President">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" name="act-startDate-${index}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" name="act-endDate-${index}" id="act-endDate-${index}">
        </div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="act-current-${index}" name="act-currentlyOngoing-${index}" onchange="toggleEndDate(this, 'act-endDate-${index}')">
        <label for="act-current-${index}">Currently ongoing</label>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="act-description-${index}" rows="3" placeholder="Describe the activity..."></textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  // Scroll to the newly added item
  setTimeout(() => {
    const newItem = container.lastElementChild;
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    newItem.querySelector('input').focus();
  }, 100);
};

function populateActivities(activities) {
  const container = document.getElementById('activitiesContainer');
  container.innerHTML = '';
  activities.forEach((act, index) => {
    globalThis.addActivity();
    const item = container.lastElementChild;
    item.querySelector(`input[name="act-title-${index}"]`).value =
      act.title || '';
    item.querySelector(`input[name="act-role-${index}"]`).value =
      act.role || '';
    item.querySelector(`input[name="act-startDate-${index}"]`).value =
      act.startDate || '';
    item.querySelector(`input[name="act-endDate-${index}"]`).value =
      act.endDate || '';
    const currentCheckbox = item.querySelector(
      `input[name="act-currentlyOngoing-${index}"]`,
    );
    currentCheckbox.checked = act.currentlyOngoing || false;
    // Disable end date if currently ongoing
    if (currentCheckbox.checked) {
      item.querySelector(`#act-endDate-${index}`).disabled = true;
    }
    item.querySelector(`textarea[name="act-description-${index}"]`).value =
      act.description || '';
  });
}

function collectActivities() {
  const container = document.getElementById('activitiesContainer');
  const activities = [];
  for (const item of container.children) {
    const index = item.dataset.index;
    const title = item.querySelector(`input[name="act-title-${index}"]`)?.value;
    if (title) {
      activities.push({
        title,
        role: item.querySelector(`input[name="act-role-${index}"]`)?.value,
        startDate: item.querySelector(`input[name="act-startDate-${index}"]`)
          ?.value,
        endDate: item.querySelector(`input[name="act-endDate-${index}"]`)
          ?.value,
        currentlyOngoing: item.querySelector(
          `input[name="act-currentlyOngoing-${index}"]`,
        )?.checked,
        description: item.querySelector(
          `textarea[name="act-description-${index}"]`,
        )?.value,
      });
    }
  }
  return activities;
}

// ============= UTILITY =============

window.toggleEndDate = function (checkbox, endDateId) {
  const endDateInput = document.getElementById(endDateId);
  if (checkbox.checked) {
    endDateInput.disabled = true;
    endDateInput.value = '';
  } else {
    endDateInput.disabled = false;
  }
};

window.removeItem = function (button) {
  button.closest('.form-item').remove();
};
