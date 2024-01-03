export const handleTocScroll = () => {
    const links = document.querySelectorAll("#table-of-contents a");
    console.log(links);
    const fromTop = window.scrollY;

    // Initialize variables to store the closest section and its distance
    let closestSection = null;
    let minDistance = Infinity;

    links.forEach((link) => {
        const href = link.getAttribute("href");
        const hash = href.substring(href.indexOf("#"));
        const section = document.querySelector(hash);

        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (distance < minDistance) {
            minDistance = distance;
            closestSection = section.id;
        }

        // const top = section?.getBoundingClientRect().top;
        // const height = section?.getBoundingClientRect().height;
        // console.log(
        //   hash,
        //   top,
        //   height,
        //   fromTop,
        //   top <= fromTop,
        //   top + height > fromTop
        // );
        // if (top <= fromTop && top + height > fromTop) {
        //   link.classList.add("active");
        // } else {
        //   link.classList.remove("active");
        // }
    });

    // Remove the 'active' class from all links
    links.forEach((link) => {
        link.classList.remove("active");
    });

    // Add the 'active' class to the link corresponding to the closest section
    document
        .querySelector(`#table-of-contents a[href="#${closestSection}"]`)
        ?.classList.add("active");
};
