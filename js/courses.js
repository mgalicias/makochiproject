function displayCourses(courses) {
  coursesGrid.innerHTML = "";

  courses.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.className = "course-card";
    courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}" loading="lazy">
            <div class="course-card-content">
                <span class="course-category">${course.category}</span>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-info">
                    <span><i class="bi bi-clock"></i> ${course.duration}</span>
                    <span><i class="bi bi-bar-chart"></i> ${course.level}</span>
                </div>
                <a href="#" class="btn btn-primary">Ver Detalles</a>
            </div>
        `;
    coursesGrid.appendChild(courseCard);
  });
}
