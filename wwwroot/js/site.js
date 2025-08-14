 const openBtn = document.getElementById('openSidebarBtn');
        const closeBtn = document.getElementById('closeSidebarBtn');
        const sidebar = document.getElementById('sidebar');
        const appRoot = document.getElementById('appRoot');
        const overlay = document.getElementById('overlay');

        function showSidebar() {
            sidebar.classList.add('show');
            appRoot.classList.add('sidebar-open');
        }
        function hideSidebar() {
            sidebar.classList.remove('show');
            appRoot.classList.remove('sidebar-open');
        }

        openBtn && openBtn.addEventListener('click', showSidebar);
        closeBtn && closeBtn.addEventListener('click', hideSidebar);
        overlay && overlay.addEventListener('click', hideSidebar);