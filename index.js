// ---------------------------
// Configuration
// ---------------------------
const GITHUB_OWNER = "TimonW-Dev";
const GITHUB_REPO = "shortitdoc-test";
const GITHUB_TOKEN = "";
const basePath = './Documentation/';
const welcomeFile = basePath + 'Welcome.md';

// Files without category
const uncategorizedFiles = [
    ""
];



// Categorized files
const categories = [
   {
      "name": "",
      "files": [""]
   }
];



// ---------------------------
// DOM Elements
// ---------------------------
const list = document.getElementById('markdown-list');
const sidebarLinks = [];

// ---------------------------
// Cookie Notice Management
// ---------------------------
function showCookieNotice() {
    const cookieNotice = document.getElementById('cookie-notice');
    const accepted = localStorage.getItem('cookieAccepted');
    
    if (!accepted) {
        cookieNotice.style.display = 'block';
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 100);
    }
}

function acceptCookies() {
    const cookieNotice = document.getElementById('cookie-notice');
    localStorage.setItem('cookieAccepted', 'true');
    cookieNotice.classList.remove('show');
    setTimeout(() => {
        cookieNotice.style.display = 'none';
    }, 300);
}

// ---------------------------
// UI: Sidebar toggle
// ---------------------------
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// ---------------------------
// Markdown parser config
// ---------------------------
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    }
});

// ---------------------------
// Sidebar links setup
// ---------------------------

function createLink(name, path) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = name.replace(/\.md$/i, '');
    a.href = "#";
    a.dataset.path = path;
    a.onclick = e => {
        e.preventDefault();
        handleLinkClick(a, path);
    };
    sidebarLinks.push(a);
    li.appendChild(a);
    list.appendChild(li);
}

function setActiveLink(link) {
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active-link'));
    if (link) link.classList.add('active-link');
}

function updateURL(docPath) {
    const url = new URL(window.location);
    url.searchParams.set('doc', docPath);
    history.pushState({ docPath }, '', url);
}

function handleLinkClick(link, path) {
    setActiveLink(link);
    loadMarkdown(path);
    
    // Only store in localStorage if cookies are accepted
    if (localStorage.getItem('cookieAccepted') === 'true') {
        localStorage.setItem('lastDocPath', path);
    }
    
    updateURL(path);
    if (window.innerWidth <= 768) document.querySelector('.sidebar').classList.remove('active');
}

// Add welcome link
createLink('Welcome', welcomeFile);

// Add uncategorized files
uncategorizedFiles.forEach(file => {
    const path = basePath + file;
    createLink(file, path);
});

// Add categorized files
categories.forEach(category => {
    const catLi = document.createElement('li');
    catLi.textContent = category.name;
    catLi.className = 'category';
    list.appendChild(catLi);

    category.files.forEach(file => {
        const path = basePath + category.name + '/' + file;
        createLink(file, path);
    });
});

// ---------------------------
// Load Markdown and GitHub metadata
// ---------------------------
async function loadGithubMeta(filePath) {
    const cleanPath = filePath.replace(/^\.\//, '');
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${encodeURIComponent(cleanPath)}&per_page=200`; // To Do: Find a solution for the page creator
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
    const resp = await fetch(url, { headers });
    if (!resp.ok) return '';
    const commits = await resp.json();
    if (!Array.isArray(commits) || !commits.length) return '';
    const contributors = [...new Set(commits.map(c => c.author && c.author.login).filter(Boolean))];
    const contributorsHtml = contributors.map(u => `<a href="https://github.com/${u}" target="_blank">@${u}</a>`).join(', ');
    const first = commits[commits.length - 1];
    const last = commits[0];
    const firstDate = new Date(first.commit.author.date).toISOString().slice(0, 10);
    const firstUser = first.author ? `<a href="https://github.com/${first.author.login}" target="_blank">@${first.author.login}</a>` : 'Unknown';
    const lastDate = new Date(last.commit.author.date).toISOString().slice(0, 10);
    const lastUser = last.author ? `<a href="https://github.com/${last.author.login}" target="_blank">@${last.author.login}</a>` : 'Unknown';
    const lastCommitUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${last.sha}`;
    return `<section class="gh-meta">
        <div><strong>Contributors:</strong> ${contributorsHtml}</div>
        <div><strong>First Published:</strong> ${firstDate} by ${firstUser}</div>
        <div><strong>Last Updated:</strong> <a href="${lastCommitUrl}" target="_blank">${lastDate}</a> by ${lastUser}</div>
    </section>`;
}

async function loadMarkdown(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load: ${path}`);
        const markdown = await response.text();
        const content = document.getElementById('markdown-content');
        const metaHtml = await loadGithubMeta(path);
        content.innerHTML = metaHtml + marked.parse(markdown);
        content.classList.add('markdown-body');
        document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
        addCopyButtons();
    } catch (error) {
        document.getElementById('markdown-content').innerHTML = `<p style="color:red;">Error loading document: ${error.message}</p>`;
    }
}

function addCopyButtons() {
    document.querySelectorAll('#markdown-content pre').forEach(pre => {
        if (pre.querySelector('.copy-btn')) return;
        const btn = document.createElement('button');
        btn.textContent = 'Copy';
        btn.className = 'copy-btn';
        btn.addEventListener('click', () => {
            const code = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(code);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 1500);
        });
        pre.insertAdjacentElement('afterbegin', btn);
    });
}

// ---------------------------
// Toast notifications
// ---------------------------
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ---------------------------
// Initial page load and URL handling
// ---------------------------
window.addEventListener('DOMContentLoaded', () => {
    // Show cookie notice
    showCookieNotice();
    
    // Setup cookie accept button
    document.getElementById('accept-cookies').addEventListener('click', acceptCookies);
    
    const params = new URLSearchParams(window.location.search);
    const docFromUrl = params.get('doc');
    
    // Only use localStorage if cookies are accepted
    const savedDoc = localStorage.getItem('cookieAccepted') === 'true' ? localStorage.getItem('lastDocPath') : null;
    const initialDoc = docFromUrl || savedDoc || welcomeFile;

    // Highlight active link
    setTimeout(() => {
        sidebarLinks.forEach(a => {
            if (a.dataset.path === initialDoc) setActiveLink(a);
        });
    }, 100);

    loadMarkdown(initialDoc);
    updateURL(initialDoc);

    document.querySelector('.share-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Page URL copied to clipboard!');
        }).catch(() => {
            showToast('Copy failed');
        });
    });
});