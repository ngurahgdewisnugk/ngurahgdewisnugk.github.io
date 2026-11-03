const projectGrid = document.getElementById("project-grid");
const projectStatus = document.getElementById("project-status");
const filterButtons = document.querySelectorAll(".filter-button");
const printResumeButton = document.getElementById("print-resume");
const projectSearch = document.getElementById("project-search");

let activeFilter = "All";
let searchQuery = "";

function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    const category = document.createElement("p");
    category.className = "project-category";
    category.textContent = project.category;
    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title;
    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary;
    const skills = document.createElement("ul");
    skills.className = "project-skills";
    project
        .skills
        .forEach((skill) => {
            const item = document.createElement("li");
            item.textContent = skill;
            skills.appendChild(item);
        });
    const links = document.createElement("div");
    links.className = "project-links";
    [
        [
            "Repository", project.repoUrl
        ],
        [
            "Live demo", project.demoUrl
        ]
    ].forEach(([label, url]) => {
        if (url) {
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = label;
            links.appendChild(link);
        }
    });
    if (!project.repoUrl && !project.demoUrl) {
        const note = document.createElement("span");
        note.textContent = "Add repository or demo links when available";
        links.appendChild(note);
    }
    card.append(category, title, summary, skills, links);
    return card;
}

function renderProjects() {
    const visibleProjects = projects.filter((project) => {
        const matchesCategory = activeFilter === "All" || project.category === activeFilter;
        const searchableText = [
            project.title, project.category, project.summary, ...project.skills
        ]
            .join(" ")
            .toLowerCase();
        const matchesSearch = searchableText.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
    projectGrid.textContent = "";
    visibleProjects.forEach(
        (project) => projectGrid.appendChild(createProjectCard(project))
    );
    const label = visibleProjects.length === 1
        ? "project"
        : "projects";
    projectStatus.textContent = `${visibleProjects.length} ${label} shown`;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((candidate) => {
            const isActive = candidate === button;
            candidate
                .classList
                .toggle("active", isActive);
            candidate.setAttribute("aria-pressed", String(isActive));
        });
        renderProjects();
    });
});
projectSearch.addEventListener("input", () => {
    searchQuery = projectSearch
        .value
        .trim()
        .toLowerCase();
    renderProjects();
});
printResumeButton.addEventListener("click", () => {
    window.print();
});
renderProjects();