const API_HOST = window.location.hostname || "localhost";
const API_BASE_URL = `http://${API_HOST}:5000/api`;

const showMessage = (elementId, message, type = "error") => {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `message ${type}`;
};

const clearMessage = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }

    element.textContent = "";
    element.className = "message";
};

const setButtonLoading = (button, isLoading, loadingText) => {
    if (!button) {
        return;
    }

    if (!button.dataset.defaultText) {
        button.dataset.defaultText = button.textContent;
    }

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : button.dataset.defaultText;
};

const getToken = () => localStorage.getItem("token");

const authFetch = async (path, options = {}) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = token;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers
        });
    } catch (error) {
        throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Make sure backend is running on port 5000.`);
    }

    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const errorMessage = responseData?.message || "Something went wrong";
        throw new Error(errorMessage);
    }

    return responseData;
};

const attachRegisterHandler = () => {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage("registerMessage");

        const submitButton = registerForm.querySelector("button[type='submit']");
        setButtonLoading(submitButton, true, "Creating account...");

        const payload = {
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value
        };

        try {
            await authFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            showMessage("registerMessage", "Account created! Redirecting to login...", "success");
            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        } catch (error) {
            showMessage("registerMessage", error.message || "Registration failed");
        } finally {
            setButtonLoading(submitButton, false, "");
        }
    });
};

const attachLoginHandler = () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage("loginMessage");

        const submitButton = loginForm.querySelector("button[type='submit']");
        setButtonLoading(submitButton, true, "Signing in...");

        const payload = {
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value
        };

        try {
            const result = await authFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            localStorage.setItem("token", result.token);
            window.location.href = "dashboard.html";
        } catch (error) {
            showMessage("loginMessage", error.message || "Login failed");
        } finally {
            setButtonLoading(submitButton, false, "");
        }
    });
};

const renderPosts = (posts) => {
    const postsContainer = document.getElementById("posts");
    if (!postsContainer) {
        return;
    }

    if (!posts.length) {
        postsContainer.innerHTML = '<p class="empty-state">No posts yet. Create one now!</p>';
        return;
    }

    postsContainer.innerHTML = posts
        .map((post) => {
            const createdAt = post.created_at ? new Date(post.created_at).toLocaleString() : "Just now";

            return `
                <article class="post-card">
                    <div class="post-card-header">
                        <h3>@${post.username || "user"}</h3>
                        <span>${createdAt}</span>
                    </div>
                    <p>${post.caption || ""}</p>
                </article>
            `;
        })
        .join("");
};

const prettyLabel = (tableName) => tableName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const renderOverview = (overview) => {
    const tableCountsContainer = document.getElementById('tableCounts');
    if (!tableCountsContainer) {
        return;
    }

    const entries = Object.entries(overview?.counts || {});
    if (!entries.length) {
        tableCountsContainer.innerHTML = '<p class="empty-state">No analytics available yet.</p>';
        return;
    }

    tableCountsContainer.innerHTML = entries
        .map(([tableName, count]) => `
            <article class="metric-card">
                <span>${prettyLabel(tableName)}</span>
                <strong>${count}</strong>
            </article>
        `)
        .join('');
};

const renderUsers = (users) => {
    const usersContainer = document.getElementById('usersList');
    if (!usersContainer) {
        return;
    }

    if (!users.length) {
        usersContainer.innerHTML = '<p class="empty-state">No registered people found.</p>';
        return;
    }

    usersContainer.innerHTML = users
        .map((user) => {
            const initials = (user.username || 'U')
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase();

            return `
                <article class="user-card">
                    <div class="user-avatar">${initials || 'U'}</div>
                    <div>
                        <h4>${user.username || 'Unknown User'}</h4>
                        <p>${user.email || 'No email available'}</p>
                    </div>
                </article>
            `;
        })
        .join('');
};

const loadOverview = async () => {
    try {
        const overview = await authFetch('/social/overview', { method: 'GET' });
        renderOverview(overview);
    } catch (error) {
        showMessage('dashboardMessage', error.message || 'Unable to load analytics');
    }
};

const loadUsers = async () => {
    const usersContainer = document.getElementById('usersList');
    if (usersContainer) {
        usersContainer.innerHTML = '<p class="loading-state">Loading people...</p>';
    }

    try {
        const users = await authFetch('/users', { method: 'GET' });
        renderUsers(users);
    } catch (error) {
        showMessage('dashboardMessage', error.message || 'Unable to load people');
    }
};

const simulateAllTables = async () => {
    clearMessage('dashboardMessage');

    try {
        const result = await authFetch('/social/simulate-all', { method: 'POST' });
        showMessage('dashboardMessage', result.message || 'Simulation complete', 'success');
        await Promise.all([loadOverview(), loadPosts()]);
    } catch (error) {
        showMessage('dashboardMessage', error.message || 'Simulation failed');
    }
};

const loadPosts = async () => {
    const postsContainer = document.getElementById("posts");
    if (postsContainer) {
        postsContainer.innerHTML = '<p class="loading-state">Loading posts...</p>';
    }

    try {
        const posts = await authFetch("/posts", { method: "GET" });
        renderPosts(posts);
    } catch (error) {
        showMessage("dashboardMessage", error.message || "Unable to load posts");
    }
};

const createPost = async () => {
    clearMessage("dashboardMessage");

    const captionInput = document.getElementById("caption");
    const submitButton = document.getElementById("createPostButton");
    const caption = captionInput?.value.trim();

    if (!caption) {
        showMessage("dashboardMessage", "Write something before posting.");
        return;
    }

    try {
        setButtonLoading(submitButton, true, "Posting...");

        const mediaUrl = document.getElementById('mediaUrl')?.value.trim() || null;
        const location = document.getElementById('location')?.value.trim() || null;
        const mentionedUserIdRaw = document.getElementById('mentionedUserId')?.value.trim();
        const tagsRaw = document.getElementById('tags')?.value || '';
        const tags = tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean);
        const mentionedUserId = mentionedUserIdRaw ? Number(mentionedUserIdRaw) : null;

        await authFetch("/posts", {
            method: "POST",
            body: JSON.stringify({
                caption,
                mediaUrl,
                tags,
                mentionedUserId,
                location
            })
        });

        if (captionInput) {
            captionInput.value = "";
        }

        const mediaInput = document.getElementById('mediaUrl');
        const tagsInput = document.getElementById('tags');
        const mentionedInput = document.getElementById('mentionedUserId');
        const locationInput = document.getElementById('location');

        if (mediaInput) mediaInput.value = '';
        if (tagsInput) tagsInput.value = '';
        if (mentionedInput) mentionedInput.value = '';
        if (locationInput) locationInput.value = '';

        showMessage("dashboardMessage", "Post created successfully!", "success");
        await Promise.all([loadPosts(), loadOverview()]);
    } catch (error) {
        showMessage("dashboardMessage", error.message || "Unable to create post");
    } finally {
        setButtonLoading(submitButton, false, "");
    }
};

const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
};

const protectDashboard = () => {
    const isDashboardPage = document.getElementById("dashboardPage");
    if (!isDashboardPage) {
        return;
    }

    if (!getToken()) {
        window.location.href = "login.html";
        return;
    }

    loadPosts();
    loadUsers();
    loadOverview();
};

window.createPost = createPost;
window.loadPosts = loadPosts;
window.logout = logout;
window.loadOverview = loadOverview;
window.loadUsers = loadUsers;
window.simulateAllTables = simulateAllTables;

attachRegisterHandler();
attachLoginHandler();
protectDashboard();