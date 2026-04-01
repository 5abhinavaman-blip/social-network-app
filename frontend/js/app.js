document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    console.log(result); // 👈 ADD THIS LINE (debug)

    if (result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "dashboard.html";   // 👈 redirect
    } else {
        alert(result.message);
    }
});