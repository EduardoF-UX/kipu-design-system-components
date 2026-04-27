// Basic interactivity for the Kipu EMR prototype

document.addEventListener('DOMContentLoaded', function() {
    // Initialize reorder button visibility based on duration
    initializeReorderButtonVisibility();

    // Filter button functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // View toggle functionality
    const activeOrders = document.querySelector('.active-orders');
    const inactiveOrders = document.querySelector('.inactive-orders');
    
    inactiveOrders.addEventListener('click', function() {
        // Switch to inactive orders view
        activeOrders.style.color = '#999';
        activeOrders.style.borderBottomColor = 'transparent';
        activeOrders.style.fontWeight = '400';
        
        inactiveOrders.style.color = '#8B4B9C';
        inactiveOrders.style.borderBottomColor = '#8B4B9C';
        inactiveOrders.style.fontWeight = '500';
        
        // Hide active order tables and show inactive order tables
        const activeOrderTables = document.querySelectorAll('.active-orders-body');
        const inactiveOrderTables = document.querySelectorAll('.inactive-orders-body');
        
        activeOrderTables.forEach(table => {
            table.style.display = 'none';
        });
        
        inactiveOrderTables.forEach(table => {
            table.style.display = '';
        });
    });
    
    activeOrders.addEventListener('click', function() {
        // Switch to active orders view
        inactiveOrders.style.color = '#999';
        inactiveOrders.style.borderBottomColor = 'transparent';
        inactiveOrders.style.fontWeight = '400';
        
        activeOrders.style.color = '#8B4B9C';
        activeOrders.style.borderBottomColor = '#8B4B9C';
        activeOrders.style.fontWeight = '500';
        
        // Show active order tables and hide inactive order tables
        const activeOrderTables = document.querySelectorAll('.active-orders-body');
        const inactiveOrderTables = document.querySelectorAll('.inactive-orders-body');
        
        activeOrderTables.forEach(table => {
            table.style.display = '';
        });
        
        inactiveOrderTables.forEach(table => {
            table.style.display = 'none';
        });
    });

    // Navigation item click handlers
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    const patientSubnav = document.querySelector('.patient-subnav');
    const mainContent = document.querySelector('.main-content');
    const medlogSection = document.getElementById('medlog-section');
    const subnavTabs = patientSubnav
        ? patientSubnav.querySelectorAll('.subnav-tab')
        : document.querySelectorAll('.subnav-tab');

    subnavTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const parentContainer = this.parentElement;
            const siblingTabs = parentContainer.querySelectorAll('.subnav-tab');
            siblingTabs.forEach(sibling => sibling.classList.remove('active'));
            this.classList.add('active');

            if (medlogSection && mainContent) {
                if (this.classList.contains('subnav-tab--medlog')) {
                    for (let i = 0; i < mainContent.children.length; i++) {
                        const el = mainContent.children[i];
                        if (el.id !== 'medlog-section') el.style.display = 'none';
                    }
                    medlogSection.style.display = 'block';
                } else {
                    medlogSection.style.display = 'none';
                    for (let i = 0; i < mainContent.children.length; i++) {
                        const el = mainContent.children[i];
                        if (el.id !== 'medlog-section') el.style.display = 'block';
                    }
                }
            }
        });
    });

    // Search functionality (basic)
    const searchInputs = document.querySelectorAll('.search-input, .order-search');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (this.classList.contains('order-search')) {
                // Filter orders based on search term
                const orderRows = document.querySelectorAll('.orders-table tbody tr');
                orderRows.forEach(row => {
                    const orderText = row.textContent.toLowerCase();
                    const parentBody = row.closest('tbody');
                    
                    // Only filter visible tables
                    if (parentBody && parentBody.style.display !== 'none') {
                        if (orderText.includes(searchTerm)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });
            }
        });
    });

    // Action button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-reorder')) {
            const row = e.target.closest('tr');
            const isInactive = row.closest('.inactive-orders-body');
            
            if (isInactive) {
                alert('Reorder functionality would recreate this inactive order as a new active order.');
            } else {
                alert('Reorder functionality would allow duplicating this order with modifications.');
            }
        } else if (e.target.classList.contains('btn-change-order')) {
            alert('Change Order functionality would open a modal or form for editing this order.');
        } else if (e.target.classList.contains('btn-hold-order')) {
            const row = e.target.closest('tr');
            const orderName = row.querySelector('.order-name')?.textContent || 'Unknown order';
            alert(`Hold Order functionality would temporarily suspend this order:\n\n${orderName}\n\nThe order would remain in the system but not be administered until resumed.`);
        }
    });

    // Section controls functionality
    const sectionControls = document.querySelectorAll('.section-controls i');
    sectionControls.forEach(control => {
        control.addEventListener('click', function() {
            if (this.classList.contains('fa-plus')) {
                alert('Add new measurement/assessment functionality would be implemented here.');
            } else if (this.classList.contains('fa-ellipsis-h')) {
                alert('Additional options menu would be shown here.');
            }
        });
    });

    // Nurse review dropdown functionality
    const nurseReviewSelects = document.querySelectorAll('.nurse-review');
    nurseReviewSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log('Nurse review status changed to:', this.value);
            // Update the reviewed by information
            const row = this.closest('tr');
            const reviewedByCell = row.querySelector('.reviewed-by');
            if (reviewedByCell) {
                const currentDate = new Date().toLocaleString();
                reviewedByCell.innerHTML = `
                    <div>Current User, RN</div>
                    <div class="review-date">${currentDate}</div>
                `;
            }
        });
    });

    // Location dropdown functionality
    const locationDropdown = document.querySelector('.location-dropdown');
    locationDropdown.addEventListener('click', function() {
        alert('Location selection dropdown would be implemented here.');
    });

    // Patient action buttons
    const patientActions = document.querySelectorAll('.patient-actions i, .patient-name i');
    patientActions.forEach(action => {
        action.addEventListener('click', function() {
            if (this.classList.contains('fa-print')) {
                alert('Print patient information');
            } else if (this.classList.contains('fa-edit')) {
                alert('Edit patient information');
            } else if (this.classList.contains('fa-calendar')) {
                alert('Open calendar/scheduling');
            } else if (this.classList.contains('fa-clipboard')) {
                alert('Open assessments');
            } else if (this.classList.contains('fa-file')) {
                alert('Open documents');
            } else if (this.classList.contains('fa-folder')) {
                alert('Open file management');
            }
        });
    });

    // Breadcrumb navigation
    const breadcrumbBack = document.querySelector('.breadcrumb i');
    if (breadcrumbBack) {
        breadcrumbBack.addEventListener('click', function() {
            alert('Navigate back to clients list');
        });
    }

    // User icon functionality
    const userIcons = document.querySelectorAll('.user-icons i, .user-initials');
    userIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            if (this.classList.contains('fa-question-circle')) {
                alert('Help documentation would open here');
            } else if (this.classList.contains('fa-bell')) {
                alert('Notifications panel would open here');
            } else if (this.classList.contains('fa-user-circle') || this.classList.contains('user-initials')) {
                alert('User profile menu would open here');
            }
        });
    });

    // Filter dropdown functionality
    const filterDropdown = document.getElementById('filterDropdown');
    const filterMenu = document.getElementById('filterMenu');
    const applyFiltersBtn = document.querySelector('.apply-filters-btn');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');

    // Toggle filter menu
    filterDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        filterMenu.classList.toggle('show');
    });

    // Close filter menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!filterDropdown.contains(e.target)) {
            filterMenu.classList.remove('show');
        }
    });

    // Prevent menu from closing when clicking inside
    filterMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Apply filters functionality
    applyFiltersBtn.addEventListener('click', function() {
        applyFilters();
        filterMenu.classList.remove('show');
    });

    // Clear filters functionality
    clearFiltersBtn.addEventListener('click', function() {
        clearAllFilters();
    });

    function applyFilters() {
        const medicationsChecked = document.querySelector('input[value="medications"]').checked;
        const prnChecked = document.querySelector('input[value="prn"]').checked;
        const actionChecked = document.querySelector('input[value="action"]').checked;
        const controlledChecked = document.querySelector('input[value="controlled"]').checked;
        const dateSort = document.querySelector('input[name="dateSort"]:checked');

        // Get all sections
        const medicationsSection = document.querySelector('.medications-section');
        const prnSection = document.querySelector('.prn-orders-section');
        const actionSection = document.querySelector('.action-orders-section');

        // Show/hide sections based on type filters
        medicationsSection.style.display = medicationsChecked ? 'block' : 'none';
        prnSection.style.display = prnChecked ? 'block' : 'none';
        actionSection.style.display = actionChecked ? 'block' : 'none';

        // Filter for controlled substances
        if (controlledChecked) {
            filterControlledSubstances();
        } else {
            // Show all orders within visible sections
            showAllOrdersInVisibleSections();
        }

        // Apply date sorting
        if (dateSort) {
            sortOrdersByDate(dateSort.value);
        }

        // Update filter dropdown text
        updateFilterDropdownText();
    }

    function filterControlledSubstances() {
        // Define controlled substances (common ones)
        const controlledSubstances = [
            'xanax', 'alprazolam', 'lorazepam', 'ativan', 'diazepam', 'valium',
            'clonazepam', 'klonopin', 'morphine', 'oxycodone', 'hydrocodone',
            'fentanyl', 'tramadol', 'codeine', 'adderall', 'ritalin'
        ];

        const allOrderRows = document.querySelectorAll('.orders-table tbody tr');
        allOrderRows.forEach(row => {
            const orderText = row.querySelector('.order-name')?.textContent.toLowerCase() || '';
            const isControlled = controlledSubstances.some(substance => 
                orderText.includes(substance)
            );
            
            const parentSection = row.closest('.medications-section, .prn-orders-section, .action-orders-section');
            if (parentSection && parentSection.style.display !== 'none') {
                row.style.display = isControlled ? '' : 'none';
            }
        });
    }

    function showAllOrdersInVisibleSections() {
        const allOrderRows = document.querySelectorAll('.orders-table tbody tr');
        allOrderRows.forEach(row => {
            const parentSection = row.closest('.medications-section, .prn-orders-section, .action-orders-section');
            if (parentSection && parentSection.style.display !== 'none') {
                row.style.display = '';
            }
        });
    }

    function sortOrdersByDate(sortType) {
        const sections = ['.medications-section', '.prn-orders-section', '.action-orders-section'];
        
        sections.forEach(sectionSelector => {
            const section = document.querySelector(sectionSelector);
            if (section && section.style.display !== 'none') {
                const tbody = section.querySelector('.active-orders-body');
                if (tbody) {
                    const rows = Array.from(tbody.querySelectorAll('tr'));
                    
                    rows.sort((a, b) => {
                        const dateA = extractDateFromRow(a);
                        const dateB = extractDateFromRow(b);
                        
                        if (sortType === 'newest') {
                            return dateB - dateA;
                        } else {
                            return dateA - dateB;
                        }
                    });
                    
                    // Re-append rows in sorted order
                    rows.forEach(row => tbody.appendChild(row));
                }
            }
        });
    }

    function extractDateFromRow(row) {
        const dateCell = row.querySelector('.date-info div');
        if (dateCell) {
            const dateText = dateCell.textContent.replace('Start: ', '');
            return new Date(dateText);
        }
        return new Date(0); // Default to epoch if no date found
    }

    function clearAllFilters() {
        // Reset all checkboxes to checked (except controlled substances)
        document.querySelector('input[value="medications"]').checked = true;
        document.querySelector('input[value="prn"]').checked = true;
        document.querySelector('input[value="action"]').checked = true;
        document.querySelector('input[value="controlled"]').checked = false;
        
        // Clear radio buttons
        const radioButtons = document.querySelectorAll('input[name="dateSort"]');
        radioButtons.forEach(radio => radio.checked = false);
        
        // Show all sections
        document.querySelector('.medications-section').style.display = 'block';
        document.querySelector('.prn-orders-section').style.display = 'block';
        document.querySelector('.action-orders-section').style.display = 'block';
        
        // Show all orders
        showAllOrdersInVisibleSections();
        
        // Reset filter dropdown text
        document.querySelector('.sort-dropdown span').textContent = 'Sort by creation date';
    }

    function updateFilterDropdownText() {
        const checkedTypes = [];
        if (document.querySelector('input[value="medications"]').checked) checkedTypes.push('Medications');
        if (document.querySelector('input[value="prn"]').checked) checkedTypes.push('PRN');
        if (document.querySelector('input[value="action"]').checked) checkedTypes.push('Actions');
        
        const controlledChecked = document.querySelector('input[value="controlled"]').checked;
        const dateSort = document.querySelector('input[name="dateSort"]:checked');
        
        let filterText = 'Filters applied';
        if (checkedTypes.length === 3 && !controlledChecked && !dateSort) {
            filterText = 'Sort by creation date';
        } else if (checkedTypes.length > 0) {
            filterText = `Showing: ${checkedTypes.join(', ')}`;
            if (controlledChecked) filterText += ' (Controlled)';
            if (dateSort) filterText += ` (${dateSort.value === 'newest' ? 'Newest' : 'Oldest'} first)`;
        }
        
        document.querySelector('.sort-dropdown span').textContent = filterText;
    }

    console.log('Kipu EMR prototype loaded successfully!');

    // Medication Order Modal functionality
    const customOrdersBtn = document.getElementById('customOrdersBtn');
    const medicationModal = document.getElementById('medicationModal');
    const closeModal = document.getElementById('closeModal');
    
    // Show modal when Custom Orders button is clicked
    customOrdersBtn.addEventListener('click', function() {
        medicationModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Initialize medication search functionality when modal opens
        setTimeout(() => {
            initializeMedicationSearch();
            initializeOutsideRxFunctionality();
        }, 100);
    });
    
    // Hide modal when close button is clicked
    closeModal.addEventListener('click', function() {
        medicationModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
    
    // Hide modal when clicking outside the modal container
    medicationModal.addEventListener('click', function(e) {
        if (e.target === medicationModal) {
            medicationModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Modal tab functionality
    const modalTabs = document.querySelectorAll('.modal-tab');
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            modalTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });
    
    // Expandable sections functionality
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            const content = this.parentElement.querySelector('.criteria-content');
            const icon = this.querySelector('i');
            
            if (isExpanded) {
                this.classList.remove('expanded');
                if (content) content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            } else {
                this.classList.add('expanded');
                if (content) content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
    
    // Modal form buttons functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-medication')) {
            alert('Add Medication functionality would add this medication to the order list.');
        } else if (e.target.classList.contains('btn-submit')) {
            alert('Submit functionality would save all medications and close the modal.');
            medicationModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && medicationModal.classList.contains('show')) {
            medicationModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Criteria table interactive functionality
    function createAssessmentOptions() {
        return `
            <option value="">Select Assessment</option>
            <option value="glucose">Glucose</option>
            <option value="height-weight">Height and Weight</option>
            <option value="orthostatic-vitals">Orthostatic Vitals</option>
            <option value="vitals">Vitals</option>
            <option value="blood-pressure">Blood Pressure</option>
            <option value="ciwa-ar">CIWA-AR</option>
            <option value="ciwa-b">CIWA-B</option>
            <option value="cows">COWS</option>
        `;
    }

    function createConditionOptions() {
        return `
            <option value=">">&gt;</option>
            <option value="=">=</option>
            <option value="<">&lt;</option>
        `;
    }

    function createActionOptions() {
        return `
            <option value="do-not-administer">Do not administer</option>
            <option value="administer">Administer</option>
        `;
    }

    function addCriteriaRow() {
        const tbody = document.querySelector('.criteria-table tbody');
        const newRow = document.createElement('tr');
        
        // Check if an assessment has been selected in the first row
        const firstAssessmentSelect = tbody.querySelector('tr:first-child .table-select');
        const hasSelectedAssessment = firstAssessmentSelect && firstAssessmentSelect.value !== '';
        
        if (hasSelectedAssessment) {
            // Only show Condition, Action, and Dose for subsequent rows
            newRow.innerHTML = `
                <td class="assessment-label">${firstAssessmentSelect.options[firstAssessmentSelect.selectedIndex].text}</td>
                <td>
                    <select class="table-select">
                        ${createConditionOptions()}
                    </select>
                </td>
                <td>
                    <select class="table-select">
                        ${createActionOptions()}
                    </select>
                </td>
                <td>
                    <input type="text" class="table-input" placeholder="Enter dose">
                    <button type="button" class="remove-row-btn" onclick="removeRow(this)">&times;</button>
                </td>
            `;
        } else {
            // If no assessment selected yet, show full row
            newRow.innerHTML = `
                <td>
                    <select class="table-select">
                        ${createAssessmentOptions()}
                    </select>
                </td>
                <td>
                    <select class="table-select">
                        ${createConditionOptions()}
                    </select>
                </td>
                <td>
                    <select class="table-select">
                        ${createActionOptions()}
                    </select>
                </td>
                <td>
                    <input type="text" class="table-input" placeholder="Enter dose">
                    <button type="button" class="remove-row-btn" onclick="removeRow(this)">&times;</button>
                </td>
            `;
        }
        
        tbody.appendChild(newRow);
    }

    function removeRow(button) {
        const row = button.closest('tr');
        const tbody = row.parentElement;
        
        // Don't remove if it's the only row
        if (tbody.children.length > 1) {
            row.remove();
        }
    }

    // Add event listeners for criteria table interactions
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('table-select') || e.target.classList.contains('table-input')) {
            console.log('Criteria updated:', {
                field: e.target.className,
                value: e.target.value
            });
            
            // Check if this is an assessment selection in the first column
            const row = e.target.closest('tr');
            const tbody = row.parentElement;
            const section = row.closest('.expandable-section');
            const isFirstColumn = e.target.closest('td') === row.querySelector('td:first-child');
            const isFirstRow = row === tbody.querySelector('tr:first-child');
            
            if (isFirstColumn && isFirstRow) {
                const isShiftDosingTable = tbody.closest('.shift-dosing-table');
                
                if (e.target.value !== '') {
                    if (isShiftDosingTable) {
                        updateShiftDosingTable(e.target);
                    } else {
                        updateCriteriaTableInSection(e.target, section);
                    }
                } else {
                    if (isShiftDosingTable) {
                        restoreShiftDosingDropdowns();
                    } else {
                        restoreCriteriaDropdownsInSection(section);
                    }
                }
            }
        }
    });

    function updateCriteriaTable(assessmentSelect) {
        const selectedText = assessmentSelect.options[assessmentSelect.selectedIndex].text;
        const tbody = assessmentSelect.closest('tbody');
        const allRows = tbody.querySelectorAll('tr');
        
        // Update all rows except the first one
        allRows.forEach((row, index) => {
            if (index > 0) {
                const firstCell = row.querySelector('td:first-child');
                const assessmentDropdown = firstCell.querySelector('select');
                const existingLabel = firstCell.querySelector('.assessment-label');
                
                if (assessmentDropdown) {
                    // Replace dropdown with label
                    firstCell.innerHTML = `<span class="assessment-label">${selectedText}</span>`;
                } else if (existingLabel) {
                    // Update existing label with new assessment
                    existingLabel.textContent = selectedText;
                }
            }
        });
    }

    function updateCriteriaTableInSection(assessmentSelect, section) {
        const selectedText = assessmentSelect.options[assessmentSelect.selectedIndex].text;
        const tbody = section.querySelector('.criteria-table tbody');
        const allRows = tbody.querySelectorAll('tr');
        
        // Update all rows except the first one in this specific section
        allRows.forEach((row, index) => {
            if (index > 0) {
                const firstCell = row.querySelector('td:first-child');
                const assessmentDropdown = firstCell.querySelector('select');
                const existingLabel = firstCell.querySelector('.assessment-label');
                
                if (assessmentDropdown) {
                    // Replace dropdown with label
                    firstCell.innerHTML = `<span class="assessment-label">${selectedText}</span>`;
                } else if (existingLabel) {
                    // Update existing label with new assessment
                    existingLabel.textContent = selectedText;
                }
            }
        });
    }

    function restoreCriteriaDropdowns() {
        const tbody = document.querySelector('.criteria-table tbody');
        const allRows = tbody.querySelectorAll('tr');
        
        // Restore dropdowns for all rows except the first one
        allRows.forEach((row, index) => {
            if (index > 0) {
                const firstCell = row.querySelector('td:first-child');
                const existingLabel = firstCell.querySelector('.assessment-label');
                
                if (existingLabel) {
                    // Replace label with dropdown
                    firstCell.innerHTML = `
                        <select class="table-select">
                            ${createAssessmentOptions()}
                        </select>
                    `;
                }
            }
        });
    }

    function restoreCriteriaDropdownsInSection(section) {
        const tbody = section.querySelector('.criteria-table tbody');
        const allRows = tbody.querySelectorAll('tr');
        
        // Restore dropdowns for all rows except the first one in this specific section
        allRows.forEach((row, index) => {
            if (index > 0) {
                const firstCell = row.querySelector('td:first-child');
                const existingLabel = firstCell.querySelector('.assessment-label');
                
                if (existingLabel) {
                    // Replace label with dropdown
                    firstCell.innerHTML = `
                        <select class="table-select">
                            ${createAssessmentOptions()}
                        </select>
                    `;
                }
            }
        });
    }

    function addNewCriteriaSection() {
        let criteriaCounter = document.querySelectorAll('.expandable-section').length;
        const newSectionHtml = `
            <div class="expandable-section">
                <button class="expand-btn expanded" type="button">
                    <span>ADD CRITERIA BASED DOSING ${criteriaCounter}</span>
                    <i class="fas fa-chevron-up"></i>
                </button>
                <div class="criteria-content">
                    <table class="criteria-table">
                        <thead>
                            <tr>
                                <th>Measurement/Assessment</th>
                                <th>Condition</th>
                                <th>Action</th>
                                <th>Dose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select class="table-select">
                                        ${createAssessmentOptions()}
                                    </select>
                                </td>
                                <td>
                                    <select class="table-select">
                                        ${createConditionOptions()}
                                    </select>
                                </td>
                                <td>
                                    <select class="table-select">
                                        ${createActionOptions()}
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="table-input" placeholder="Enter dose">
                                    <button type="button" class="remove-row-btn" onclick="removeRow(this)">&times;</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" class="add-criteria-btn" onclick="addCriteriaRowToSection(this)">
                        <i class="fas fa-plus"></i> Add Criteria Row
                    </button>
                    <button type="button" class="add-new-criteria-btn" onclick="addNewCriteriaSection()">
                        <i class="fas fa-plus-circle"></i> Add another Criteria Based Dosing
                    </button>
                    <button type="button" class="remove-section-btn" onclick="removeCriteriaSection(this)">
                        <i class="fas fa-trash"></i> Remove Section
                    </button>
                </div>
            </div>
        `;
        
        // Find the last expandable section and insert the new one after it
        const lastSection = document.querySelector('.expandable-section:last-of-type');
        lastSection.insertAdjacentHTML('afterend', newSectionHtml);
        
        // Add event listener for the new expand button
        const newSection = lastSection.nextElementSibling;
        const expandBtn = newSection.querySelector('.expand-btn');
        expandBtn.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            const content = this.parentElement.querySelector('.criteria-content');
            const icon = this.querySelector('i');
            
            if (isExpanded) {
                this.classList.remove('expanded');
                if (content) content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            } else {
                this.classList.add('expanded');
                if (content) content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            }
        });
    }

    function addCriteriaRowToSection(button) {
        const section = button.closest('.expandable-section');
        const tbody = section.querySelector('.criteria-table tbody');
        const newRow = document.createElement('tr');
        
        // Check if an assessment has been selected in the first row of this specific section
        const firstAssessmentSelect = tbody.querySelector('tr:first-child .table-select');
        const hasSelectedAssessment = firstAssessmentSelect && firstAssessmentSelect.value !== '';
        
        if (hasSelectedAssessment) {
            // Only show Condition, Action, and Dose for subsequent rows
            newRow.innerHTML = `
                <td class="assessment-label">${firstAssessmentSelect.options[firstAssessmentSelect.selectedIndex].text}</td>
                <td>
                    <select class="table-select">
                        ${createConditionOptions()}
                    </select>
                </td>
                <td>
                    <select class="table-select">
                        ${createActionOptions()}
                    </select>
                </td>
                <td>
                    <input type="text" class="table-input" placeholder="Enter dose">
                    <button type="button" class="remove-row-btn" onclick="removeRow(this)">&times;</button>
                </td>
            `;
        } else {
            // If no assessment selected yet, show full row
            newRow.innerHTML = `
                <td>
                    <select class="table-select">
                        ${createAssessmentOptions()}
                    </select>
                </td>
                <td>
                    <select class="table-select">
                        ${createConditionOptions()}
                    </select>
                </td>
                <td>
                    <select class="table-select">
                        ${createActionOptions()}
                    </select>
                </td>
                <td>
                    <input type="text" class="table-input" placeholder="Enter dose">
                    <button type="button" class="remove-row-btn" onclick="removeRow(this)">&times;</button>
                </td>
            `;
        }
        
        tbody.appendChild(newRow);
    }

    function removeCriteriaSection(button) {
        const section = button.closest('.expandable-section');
        const allSections = document.querySelectorAll('.expandable-section');
        
        // Don't remove if it's the only section
        if (allSections.length > 2) { // 2 because we have "Add Max Daily Dose" + at least one criteria section
            section.remove();
        } else {
            alert('Cannot remove the last criteria section.');
        }
    }

    // Shift Dosing Functions
    function addShiftDosingRow() {
        const tbody = document.querySelector('.shift-dosing-table tbody');
        const newRow = document.createElement('tr');
        
        // Check if an assessment has been selected in the first row
        const firstAssessmentSelect = tbody.querySelector('tr:first-child .table-select');
        const hasSelectedAssessment = firstAssessmentSelect && firstAssessmentSelect.value !== '';
        
        if (hasSelectedAssessment) {
            // Only show Condition & Value, and Shift Instructions for subsequent rows
            newRow.innerHTML = `
                <td>
                    <span class="assessment-label">${firstAssessmentSelect.options[firstAssessmentSelect.selectedIndex].text}</span>
                </td>
                <td>
                    <div class="condition-group">
                        <select class="table-select condition-select">
                            ${createConditionOptions()}
                        </select>
                        <input type="number" class="table-input value-input" placeholder="Value">
                    </div>
                </td>
                <td>
                    <input type="number" class="table-input" placeholder="Enter value" step="0.01">
                    <button type="button" class="remove-row-btn" onclick="removeShiftRow(this)">&times;</button>
                </td>
            `;
        } else {
            // If no assessment selected yet, show full row
            newRow.innerHTML = `
                <td>
                    <select class="table-select">
                        ${createAssessmentOptions()}
                    </select>
                </td>
                <td>
                    <div class="condition-group">
                        <select class="table-select condition-select">
                            ${createConditionOptions()}
                        </select>
                        <input type="number" class="table-input value-input" placeholder="Value">
                    </div>
                </td>
                <td>
                    <input type="number" class="table-input" placeholder="Enter value" step="0.01">
                    <button type="button" class="remove-row-btn" onclick="removeShiftRow(this)">&times;</button>
                </td>
            `;
        }
        
        tbody.appendChild(newRow);
    }

    function removeShiftRow(button) {
        const row = button.closest('tr');
        const tbody = row.parentElement;
        
        // Don't remove if it's the only row
        if (tbody.children.length > 1) {
            row.remove();
        }
    }

    function updateShiftDosingTable(assessmentSelect) {
        const selectedText = assessmentSelect.options[assessmentSelect.selectedIndex].text;
        const tbody = assessmentSelect.closest('tbody');
        const allRows = tbody.querySelectorAll('tr');
        
        // Update all rows except the first one
        allRows.forEach((row, index) => {
            if (index > 0) {
                const firstCell = row.querySelector('td:first-child');
                const assessmentDropdown = firstCell.querySelector('select');
                const existingLabel = firstCell.querySelector('.assessment-label');
                
                if (assessmentDropdown) {
                    // Replace dropdown with label
                    firstCell.innerHTML = `<span class="assessment-label">${selectedText}</span>`;
                } else if (existingLabel) {
                    // Update existing label with new assessment
                    existingLabel.textContent = selectedText;
                }
            }
        });
    }

    function restoreShiftDosingDropdowns() {
        const tbody = document.querySelector('.shift-dosing-table tbody');
        const allRows = tbody.querySelectorAll('tr');
        
        // Restore dropdowns for all rows except the first one
        allRows.forEach((row, index) => {
            if (index > 0) {
                const firstCell = row.querySelector('td:first-child');
                const existingLabel = firstCell.querySelector('.assessment-label');
                
                if (existingLabel) {
                    // Replace label with dropdown
                    firstCell.innerHTML = `
                        <select class="table-select">
                            ${createAssessmentOptions()}
                        </select>
                    `;
                }
            }
        });
    }

    // Make functions globally available
    window.removeRow = removeRow;
    window.addCriteriaRow = addCriteriaRow;
    window.updateCriteriaTable = updateCriteriaTable;
    window.restoreCriteriaDropdowns = restoreCriteriaDropdowns;
    window.addNewCriteriaSection = addNewCriteriaSection;
    window.addCriteriaRowToSection = addCriteriaRowToSection;
    window.removeCriteriaSection = removeCriteriaSection;
    window.addShiftDosingRow = addShiftDosingRow;
    window.removeShiftRow = removeShiftRow;
    window.updateShiftDosingTable = updateShiftDosingTable;
    window.restoreShiftDosingDropdowns = restoreShiftDosingDropdowns;

    // Medication Search Functionality
    function initializeMedicationSearch() {
        const searchInput = document.getElementById('medicationSearch');
        const dropdown = document.getElementById('medicationDropdown');
        const options = dropdown.querySelectorAll('.medication-option');
        let highlightedIndex = -1;
        
        // Show dropdown when input is focused or has content
        searchInput.addEventListener('focus', function() {
            dropdown.classList.add('show');
            filterOptions(''); // Show all options initially
        });
        
        // Filter options as user types
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterOptions(searchTerm);
            highlightedIndex = -1; // Reset highlight
            dropdown.classList.add('show');
        });
        
        // Handle keyboard navigation
        searchInput.addEventListener('keydown', function(e) {
            const visibleOptions = dropdown.querySelectorAll('.medication-option:not(.hidden)');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    highlightedIndex = Math.min(highlightedIndex + 1, visibleOptions.length - 1);
                    updateHighlight(visibleOptions);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    highlightedIndex = Math.max(highlightedIndex - 1, -1);
                    updateHighlight(visibleOptions);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
                        selectOption(visibleOptions[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    dropdown.classList.remove('show');
                    this.blur();
                    break;
            }
        });
        
        // Handle option clicks
        options.forEach(option => {
            option.addEventListener('click', function() {
                selectOption(this);
            });
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        function filterOptions(searchTerm) {
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.classList.remove('hidden');
                } else {
                    option.classList.add('hidden');
                }
            });
        }
        
        function updateHighlight(visibleOptions) {
            // Remove previous highlights
            options.forEach(option => option.classList.remove('highlighted'));
            
            // Add highlight to current option
            if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
                visibleOptions[highlightedIndex].classList.add('highlighted');
                visibleOptions[highlightedIndex].scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
        
            function selectOption(option) {
        const medicationName = option.textContent.split(' - ')[0]; // Get just the medication name part
        const route = option.getAttribute('data-route');
        const dosageForm = option.getAttribute('data-dosage-form');
        
        // Set medication name
        searchInput.value = medicationName;
        
        // Auto-populate route with visual feedback
        const routeSelect = document.getElementById('routeSelect');
        if (routeSelect && route) {
            routeSelect.value = route;
            routeSelect.classList.add('auto-populated-flash');
            setTimeout(() => {
                routeSelect.classList.remove('auto-populated-flash');
            }, 2000);
        }
        
        // Auto-populate dosage form with visual feedback
        const dosageFormSelect = document.getElementById('dosageFormSelect');
        if (dosageFormSelect && dosageForm) {
            dosageFormSelect.value = dosageForm;
            dosageFormSelect.classList.add('auto-populated-flash');
            setTimeout(() => {
                dosageFormSelect.classList.remove('auto-populated-flash');
            }, 2000);
        }
        
        dropdown.classList.remove('show');
        highlightedIndex = -1;
        
        // Remove all highlights
        options.forEach(opt => opt.classList.remove('highlighted'));
        
        // Trigger any additional logic for medication selection
        console.log('Selected medication:', {
            name: medicationName,
            route: route,
            dosageForm: dosageForm
        });
    }
    }

    // Outside Rx functionality
    function initializeOutsideRxFunctionality() {
        const outsideRxCheckbox = document.getElementById('outsideRx');
        const outsideRxFields = document.getElementById('outsideRxFields');
        
        if (outsideRxCheckbox && outsideRxFields) {
            outsideRxCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    outsideRxFields.style.display = 'block';
                    // Animate the appearance
                    outsideRxFields.style.opacity = '0';
                    setTimeout(() => {
                        outsideRxFields.style.transition = 'opacity 0.3s ease';
                        outsideRxFields.style.opacity = '1';
                    }, 10);
                } else {
                    outsideRxFields.style.transition = 'opacity 0.3s ease';
                    outsideRxFields.style.opacity = '0';
                    setTimeout(() => {
                        outsideRxFields.style.display = 'none';
                        // Clear the fields when hiding
                        document.getElementById('providerName').value = '';
                        document.getElementById('facilityName').value = '';
                        document.getElementById('prescriptionId').value = '';
                    }, 300);
                }
            });
        }
    }


}); 

// Function to initialize reorder button visibility based on duration
function initializeReorderButtonVisibility() {
    const orderRows = document.querySelectorAll('.orders-table tbody tr');
    
    orderRows.forEach(row => {
        const hasDuration = row.getAttribute('data-has-duration') === 'true';
        const actionButtons = row.querySelector('.action-buttons');
        const reorderButton = actionButtons ? actionButtons.querySelector('.btn-reorder') : null;
        
        if (reorderButton) {
            if (!hasDuration) {
                // Hide the reorder button for orders without duration
                reorderButton.style.display = 'none';
            } else {
                // Ensure the reorder button is visible for orders with duration
                reorderButton.style.display = 'inline-block';
            }
        }
    });
}

// Order Status Toggle Function
function toggleOrderStatus(element) {
    const expandableDetails = element.nextElementSibling;
    const expandIcon = element.querySelector('.expand-icon');
    
    if (expandableDetails.style.display === 'none') {
        expandableDetails.style.display = 'block';
        expandableDetails.classList.add('show');
        expandIcon.classList.add('expanded');
    } else {
        expandableDetails.style.display = 'none';
        expandableDetails.classList.remove('show');
        expandIcon.classList.remove('expanded');
    }
}

    // Discontinue Orders Modal functionality
    const discontinueOrdersBtn = document.getElementById('discontinueOrdersBtn');
    const discontinueModal = document.getElementById('discontinueModal');
    const closeDiscontinueModal = document.getElementById('closeDiscontinueModal');
    const cancelDiscontinue = document.getElementById('cancelDiscontinue');
    const submitDiscontinue = document.getElementById('submitDiscontinue');
    
    // Show modal when Discontinue Orders button is clicked
    discontinueOrdersBtn.addEventListener('click', function() {
        discontinueModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Initialize form validation
        validateDiscontinueForm();
    });
    
    // Hide modal when close button is clicked
    closeDiscontinueModal.addEventListener('click', function() {
        closeDiscontinueModalHandler();
    });
    
    // Hide modal when cancel button is clicked
    cancelDiscontinue.addEventListener('click', function() {
        closeDiscontinueModalHandler();
    });
    
    // Hide modal when clicking outside the modal container
    discontinueModal.addEventListener('click', function(e) {
        if (e.target === discontinueModal) {
            closeDiscontinueModalHandler();
        }
    });
    
    // Escape key to close discontinue modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && discontinueModal.classList.contains('show')) {
            closeDiscontinueModalHandler();
        }
    });
    
    function closeDiscontinueModalHandler() {
        discontinueModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
        resetDiscontinueForm();
    }
    
    function resetDiscontinueForm() {
        // Uncheck all medication checkboxes
        const checkboxes = document.querySelectorAll('.med-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear form fields
        document.getElementById('discontinueReason').value = '';
        document.getElementById('orderedBy').value = '';
        document.getElementById('via').value = '';
        
        // Reset submit button state
        validateDiscontinueForm();
    }
    
    // Form validation for discontinue modal
    function validateDiscontinueForm() {
        const orderedBy = document.getElementById('orderedBy').value;
        const via = document.getElementById('via').value;
        const checkedMedications = document.querySelectorAll('.med-checkbox:checked');
        const submitBtn = document.getElementById('submitDiscontinue');
        
        // Enable submit button only if required fields are filled and at least one medication is selected
        const isValid = orderedBy && via && checkedMedications.length > 0;
        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
    }
    
    // Add event listeners for form validation
    document.getElementById('orderedBy').addEventListener('change', validateDiscontinueForm);
    document.getElementById('via').addEventListener('change', validateDiscontinueForm);
    
    // Add event listeners for medication checkboxes
    const medicationCheckboxes = document.querySelectorAll('.med-checkbox');
    medicationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            validateDiscontinueForm();
            
            // Visual feedback for selected medications
            const medicationItem = this.closest('.medication-item');
            if (this.checked) {
                medicationItem.style.backgroundColor = '#e8f4fd';
                medicationItem.style.borderColor = '#4a90e2';
            } else {
                medicationItem.style.backgroundColor = '#f5f5f5';
                medicationItem.style.borderColor = '#e0e0e0';
            }
        });
    });
    
    // Submit discontinue form
    submitDiscontinue.addEventListener('click', function() {
        const checkedMedications = document.querySelectorAll('.med-checkbox:checked');
        const discontinueReason = document.getElementById('discontinueReason').value;
        const orderedBy = document.getElementById('orderedBy').value;
        const via = document.getElementById('via').value;
        
        if (checkedMedications.length === 0) {
            alert('Please select at least one medication to discontinue.');
            return;
        }
        
        if (!orderedBy || !via) {
            alert('Please fill in all required fields (Ordered by and Via).');
            return;
        }
        
        // Collect selected medications
        const selectedMedications = Array.from(checkedMedications).map(checkbox => {
            const label = checkbox.nextElementSibling;
            return label ? label.textContent : 'Unknown medication';
        });
        
        // Simulate discontinue order submission
        const discontinueData = {
            medications: selectedMedications,
            reason: discontinueReason,
            orderedBy: orderedBy,
            via: via,
            timestamp: new Date().toISOString()
        };
        
        console.log('Discontinue order submitted:', discontinueData);
        
        // Show success message
        alert(`Successfully submitted discontinuation for ${selectedMedications.length} medication(s):\n\n${selectedMedications.join('\n')}\n\nReason: ${discontinueReason || 'Not specified'}\nOrdered by: ${orderedBy}\nVia: ${via}`);
        
        // Close modal and reset form
        closeDiscontinueModalHandler();
        
        // In a real application, you would:
        // 1. Send the data to the server
        // 2. Update the UI to reflect the discontinued orders
        // 3. Move the orders to the inactive orders section
        // 4. Show appropriate status changes
    });

    // Make toggle function globally available
window.toggleOrderStatus = toggleOrderStatus;

    // Continue on Discharge Modal functionality
    const continueOnDischargeBtn = document.getElementById('continueOnDischargeBtn');
    const continueDischargeModal = document.getElementById('continueDischargeModal');
    const closeContinueDischargeModal = document.getElementById('closeContinueDischargeModal');
    const cancelContinueDischarge = document.getElementById('cancelContinueDischarge');
    const submitContinueDischarge = document.getElementById('submitContinueDischarge');
    
    // Show modal when Continue on Discharge button is clicked
    continueOnDischargeBtn.addEventListener('click', function() {
        continueDischargeModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Initialize form validation
        validateContinueDischargeForm();
    });
    
    // Hide modal when close button is clicked
    closeContinueDischargeModal.addEventListener('click', function() {
        closeContinueDischargeModalHandler();
    });
    
    // Hide modal when cancel button is clicked
    cancelContinueDischarge.addEventListener('click', function() {
        closeContinueDischargeModalHandler();
    });
    
    // Hide modal when clicking outside the modal container
    continueDischargeModal.addEventListener('click', function(e) {
        if (e.target === continueDischargeModal) {
            closeContinueDischargeModalHandler();
        }
    });
    
    // Escape key to close continue discharge modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && continueDischargeModal.classList.contains('show')) {
            closeContinueDischargeModalHandler();
        }
    });
    
    function closeContinueDischargeModalHandler() {
        continueDischargeModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
        resetContinueDischargeForm();
    }
    
    function resetContinueDischargeForm() {
        // Uncheck all medication checkboxes
        const checkboxes = document.querySelectorAll('.med-checkbox-continue');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear form fields
        document.getElementById('continueOrderedBy').value = '';
        document.getElementById('continueVia').value = '';
        
        // Reset submit button state
        validateContinueDischargeForm();
        
        // Reset medication item styling
        const medicationItems = document.querySelectorAll('.continue-discharge-modal .medication-item');
        medicationItems.forEach(item => {
            item.style.backgroundColor = '#ffffff';
            item.style.borderColor = '#e0e0e0';
        });
    }
    
    // Form validation for continue discharge modal
    function validateContinueDischargeForm() {
        const orderedBy = document.getElementById('continueOrderedBy').value;
        const via = document.getElementById('continueVia').value;
        const checkedMedications = document.querySelectorAll('.med-checkbox-continue:checked');
        const submitBtn = document.getElementById('submitContinueDischarge');
        
        // Enable submit button only if required fields are filled and at least one medication is selected
        const isValid = orderedBy && via && checkedMedications.length > 0;
        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
    }
    
    // Add event listeners for form validation
    document.getElementById('continueOrderedBy').addEventListener('change', validateContinueDischargeForm);
    document.getElementById('continueVia').addEventListener('change', validateContinueDischargeForm);
    
    // Add event listeners for medication checkboxes
    const continueCheckboxes = document.querySelectorAll('.med-checkbox-continue');
    continueCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            validateContinueDischargeForm();
            
            // Visual feedback for selected medications
            const medicationItem = this.closest('.medication-item');
            if (this.checked) {
                medicationItem.style.backgroundColor = '#e8f4fd';
                medicationItem.style.borderColor = '#2d5aa0';
            } else {
                medicationItem.style.backgroundColor = '#ffffff';
                medicationItem.style.borderColor = '#e0e0e0';
            }
        });
    });
    
    // Submit continue discharge form
    submitContinueDischarge.addEventListener('click', function() {
        const checkedMedications = document.querySelectorAll('.med-checkbox-continue:checked');
        const orderedBy = document.getElementById('continueOrderedBy').value;
        const via = document.getElementById('continueVia').value;
        
        if (checkedMedications.length === 0) {
            alert('Please select at least one medication to continue on discharge.');
            return;
        }
        
        if (!orderedBy || !via) {
            alert('Please fill in all required fields (Ordered by and Via).');
            return;
        }
        
        // Collect selected medications
        const selectedMedications = Array.from(checkedMedications).map(checkbox => {
            const label = checkbox.nextElementSibling;
            return label ? label.textContent : 'Unknown medication';
        });
        
        // Simulate continue on discharge order submission
        const continueData = {
            medications: selectedMedications,
            orderedBy: orderedBy,
            via: via,
            timestamp: new Date().toISOString(),
            action: 'continue_on_discharge'
        };
        
        console.log('Continue on discharge order submitted:', continueData);
        
        // Show success message
        alert(`Successfully submitted continue on discharge for ${selectedMedications.length} medication(s):\n\n${selectedMedications.join('\n')}\n\nOrdered by: ${orderedBy}\nVia: ${via}\n\nThese medications will be continued when the patient is discharged.`);
        
        // Close modal and reset form
        closeContinueDischargeModalHandler();
        
        // In a real application, you would:
        // 1. Send the data to the server
        // 2. Update the UI to reflect the continued orders
        // 3. Add discharge continuation flags to the orders
        // 4. Generate discharge medication list
        // 5. Show appropriate status changes
    });

    // Medications Brought In Page Navigation
    // Get page elements
    const doctorOrdersPage = document.querySelector('.main-content');
    const medicationsBroughtInPage = document.getElementById('medicationsBroughtInPage');
    const medsbroughtInBtn = document.querySelector('.filter-btn:nth-child(4)'); // MEDS BROUGHT IN button
    const backToDoctorOrdersBtn = document.getElementById('backToDoctorOrders');
    
    // Navigation to Medications Brought In page
    if (medsbroughtInBtn) {
        medsbroughtInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMedicationsBroughtInPage();
        });
    }
    
    // Navigation back to Doctor Orders page
    if (backToDoctorOrdersBtn) {
        backToDoctorOrdersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showDoctorOrdersPage();
        });
    }
    
    function showMedicationsBroughtInPage() {
        if (doctorOrdersPage && medicationsBroughtInPage) {
            doctorOrdersPage.style.display = 'none';
            medicationsBroughtInPage.style.display = 'block';
            
            // Update filter button active state
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            medsbroughtInBtn.classList.add('active');
        }
    }
    
    function showDoctorOrdersPage() {
        if (doctorOrdersPage && medicationsBroughtInPage) {
            medicationsBroughtInPage.style.display = 'none';
            doctorOrdersPage.style.display = 'block';
            
            // Reset filter button active state to "SHOW ALL ORDERS"
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            const showAllOrdersBtn = document.querySelector('.filter-btn:first-child');
            if (showAllOrdersBtn) {
                showAllOrdersBtn.classList.add('active');
            }
        }
    }
    
    // Medications Brought In page functionality
    const addNewMedicationBtn = document.getElementById('addNewMedicationBtn');
    const verifyBtn = document.querySelector('.btn-verify');
    const patientSignatureBtn = document.querySelector('.btn-patient-signature');
    
    // Add New Medication functionality
    if (addNewMedicationBtn) {
        addNewMedicationBtn.addEventListener('click', function() {
            alert('Add New Medication functionality would open a form to add medications brought in by the patient.');
        });
    }
    
    // Verify functionality
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            alert('Verify functionality would allow staff to verify the medications brought in by the patient.');
        });
    }
    
    // Patient Signature functionality
    if (patientSignatureBtn) {
        patientSignatureBtn.addEventListener('click', function() {
            alert('Patient Signature functionality would capture the patient\'s electronic signature for the medications.');
        });
    }
    
    // Action select change handlers
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('action-select')) {
            const selectedAction = e.target.value;
            const row = e.target.closest('tr');
            const medicationName = row.querySelector('.medication-name').textContent;
            
            console.log(`Action changed for ${medicationName}: ${selectedAction}`);
            
            // In a real application, this would trigger additional workflows
            // based on the selected action (e.g., continue on admission, hold, dispose, etc.)
        }
        
        if (e.target.classList.contains('witness-select')) {
            const selectedWitness = e.target.value;
            const row = e.target.closest('tr');
            const medicationName = row.querySelector('.medication-name').textContent;
            
            console.log(`Witness changed for ${medicationName}: ${selectedWitness}`);
        }
    });
    
    // Edit and Add button functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit')) {
            const row = e.target.closest('tr');
            const medicationName = row.querySelector('.medication-name').textContent;
            alert(`Edit functionality would open a form to modify the details for: ${medicationName}`);
        }
        
        if (e.target.closest('.btn-add-plus')) {
            const row = e.target.closest('tr');
            const medicationName = row.querySelector('.medication-name').textContent;
            alert(`Add functionality would allow adding additional entries or notes for: ${medicationName}`);
        }
    });
    
    // Section controls for medications brought in page
    const sectionControlsIcons = document.querySelectorAll('.medications-brought-in-page .section-controls i');
    sectionControlsIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            if (this.classList.contains('fa-plus')) {
                alert('Add new medication brought in by patient functionality would be implemented here.');
            } else if (this.classList.contains('fa-ellipsis-h')) {
                alert('Additional options menu for medications brought in would be shown here.');
            }
        });
    });
});

// Order History Functions
function toggleOrderHistory(historyId) {
    console.log('toggleOrderHistory called with:', historyId);
    const historyRow = document.getElementById(historyId);
    if (!historyRow) {
        console.error('History row not found:', historyId);
        return;
    }
    
    console.log('Current display style:', historyRow.style.display);
    const isVisible = historyRow.style.display === 'table-row';
    
    const expandIcon = document.querySelector(`[onclick="toggleOrderHistory('${historyId}')"]`);

    if (isVisible) {
        historyRow.style.display = 'none';
        if (expandIcon) {
            expandIcon.classList.remove('expanded');
            expandIcon.setAttribute('aria-expanded', 'false');
        }
        console.log('Hiding history row');
    } else {
        historyRow.style.display = 'table-row';
        if (expandIcon) {
            expandIcon.classList.add('expanded');
            expandIcon.setAttribute('aria-expanded', 'true');
        }
        console.log('Showing history row');
    }
}

function toggleHistorySection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    const toggleIcon = header.querySelector('.history-toggle');
    
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
    } else {
        section.style.display = 'none';
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
    }
}