// Basic interactivity for the Kipu EMR prototype

document.addEventListener('DOMContentLoaded', function() {
    // Initialize reorder button visibility based on duration
    initializeReorderButtonVisibility();

    // Filter button functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Found filter buttons:', filterButtons.length);
    
    filterButtons.forEach((button, index) => {
        console.log(`Filter button ${index}:`, {
            text: button.textContent,
            id: button.id,
            classes: button.className
        });
        
        // Skip buttons that have special functionality (modals, etc.)
        if (button.id === 'customOrdersBtn' || button.id === 'discontinueOrdersBtn' || button.id === 'continueOnDischargeBtn' || button.id === 'medsBroughtInBtn' || button.id === 'quickOrdersBtn' || button.id === 'medReconciliationBtn') {
            console.log('Skipping special button:', button.id);
            return; // Skip these buttons - they have their own handlers
        }
        
        button.addEventListener('click', function() {
            console.log('Filter button clicked:', this.textContent);
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Orders view: System Tabs (React) dispatches 'ordersViewTabChange' with detail: 'active' | 'inactive' | 'all'
    function applyOrdersViewMode(mode) {
        const activeOrderTables = document.querySelectorAll('.active-orders-body');
        const inactiveOrderTables = document.querySelectorAll('.inactive-orders-body');
        const otherEpisodesChecked = document.querySelector('input[value="other-episodes"]')?.checked;
        const otherEpisodesBodies = document.querySelectorAll('.other-episodes-orders-body');

        if (mode === 'inactive') {
            activeOrderTables.forEach((table) => {
                table.style.display = 'none';
            });
            inactiveOrderTables.forEach((table) => {
                table.style.display = '';
            });
        } else if (mode === 'active') {
            activeOrderTables.forEach((table) => {
                table.style.display = '';
            });
            inactiveOrderTables.forEach((table) => {
                table.style.display = 'none';
            });
        } else {
            activeOrderTables.forEach((table) => {
                table.style.display = '';
            });
            inactiveOrderTables.forEach((table) => {
                table.style.display = '';
            });
        }

        if (otherEpisodesChecked) {
            otherEpisodesBodies.forEach((tbody) => {
                tbody.style.display = '';
            });
        }
    }

    document.addEventListener('ordersViewTabChange', function (e) {
        if (e.detail) applyOrdersViewMode(e.detail);
    });

    applyOrdersViewMode('active');

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

    // Patient subnav — single .subnav-tabs row; MedLog toggles medlog-section vs main sections
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

    document.addEventListener('click', function (e) {
        const clearBtn = e.target.closest('.kipu-search__clear');
        if (!clearBtn) return;
        e.preventDefault();
        const root = clearBtn.closest('.kipu-search');
        const inp = root && root.querySelector('.order-search');
        if (inp) {
            inp.value = '';
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.focus();
        }
    });

    document.querySelectorAll('.kipu-search--flat').forEach(function (wrap) {
        wrap.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            if (e.target.closest('.kipu-search__clear')) return;
            if (e.target.closest('.order-search')) return;
            const inp = wrap.querySelector('.order-search');
            if (inp) inp.focus();
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
            console.log('Hold Order button clicked');
            const row = e.target.closest('tr');
            const orderName = row.querySelector('.medication-header')?.textContent || row.querySelector('.order-name')?.textContent || 'Unknown order';
            const orderInstructions = row.querySelector('.medication-instructions')?.textContent || 'No instructions available';
            console.log('Opening hold order modal for:', orderName);
            openHoldOrderModal(orderName, orderInstructions, row);
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
    const patientActions = document.querySelectorAll('.patient-actions [data-patient-action], .patient-name [data-patient-action]');
    patientActions.forEach(action => {
        action.addEventListener('click', function() {
            const headerAction = this.getAttribute('data-patient-action');
            if (headerAction === 'print') {
                alert('Print patient information');
                return;
            }
            if (headerAction === 'edit') {
                alert('Edit patient information');
                return;
            }
            if (headerAction === 'camera') {
                alert('Open patient photo or camera');
                return;
            }
            if (headerAction === 'comment') {
                alert('Open patient comments');
                return;
            }
            if (this.classList.contains('fa-calendar')) {
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
    if (filterDropdown && filterMenu) {
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
    }

    // Apply filters functionality
    if (applyFiltersBtn && filterMenu) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
            filterMenu.classList.remove('show');
        });
    }

    // Clear filters functionality
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }

    function applyFilters() {
        const medicationsChecked = document.querySelector('input[value="medications"]').checked;
        const prnChecked = document.querySelector('input[value="prn"]').checked;
        const actionChecked = document.querySelector('input[value="action"]').checked;
        const controlledChecked = document.querySelector('input[value="controlled"]').checked;
        const heldChecked = document.querySelector('input[value="held"]').checked;
        const otherEpisodesChecked = document.querySelector('input[value="other-episodes"]').checked;
        const dateSort = document.querySelector('input[name="dateSort"]:checked');

        // Get all sections
        const medicationsSection = document.querySelector('.medications-section');
        const prnSection = document.querySelector('.prn-orders-section');
        const actionSection = document.querySelector('.action-orders-section');

        // Show/hide sections based on type filters
        medicationsSection.style.display = medicationsChecked ? 'block' : 'none';
        prnSection.style.display = prnChecked ? 'block' : 'none';
        actionSection.style.display = actionChecked ? 'block' : 'none';

        // Handle "Show Orders from Other Episodes" filter
        const otherEpisodesBodies = document.querySelectorAll('.other-episodes-orders-body');
        otherEpisodesBodies.forEach(tbody => {
            tbody.style.display = otherEpisodesChecked ? '' : 'none';
        });

        // Apply special filters
        if (controlledChecked || heldChecked) {
            applySpecialFilters(controlledChecked, heldChecked);
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

    function applySpecialFilters(controlledChecked, heldChecked) {
        // Define controlled substances (common ones)
        const controlledSubstances = [
            'xanax', 'alprazolam', 'lorazepam', 'ativan', 'diazepam', 'valium',
            'clonazepam', 'klonopin', 'morphine', 'oxycodone', 'hydrocodone',
            'fentanyl', 'tramadol', 'codeine', 'adderall', 'ritalin'
        ];

        const allOrderRows = document.querySelectorAll('.orders-table tbody tr');
        allOrderRows.forEach(row => {
            const orderText = (row.querySelector('.medication-header')?.textContent || row.querySelector('.order-name')?.textContent || '').toLowerCase();
            
            // Check for controlled substances
            const isControlled = controlledSubstances.some(substance => 
                orderText.includes(substance)
            );
            
            // Check for held orders (look for "held" tag)
            const heldTag = row.querySelector('.held-tag');
            const isHeld = heldTag !== null;
            
            // Determine if row should be shown based on selected filters
            let shouldShow = false;
            if (controlledChecked && heldChecked) {
                // Both filters selected - show orders that are either controlled OR held
                shouldShow = isControlled || isHeld;
            } else if (controlledChecked) {
                // Only controlled filter selected
                shouldShow = isControlled;
            } else if (heldChecked) {
                // Only held filter selected
                shouldShow = isHeld;
            }
            
            const parentSection = row.closest('.medications-section, .prn-orders-section, .action-orders-section');
            if (parentSection && parentSection.style.display !== 'none') {
                row.style.display = shouldShow ? '' : 'none';
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
        // Reset all checkboxes to checked (except special filters)
        document.querySelector('input[value="medications"]').checked = true;
        document.querySelector('input[value="prn"]').checked = true;
        document.querySelector('input[value="action"]').checked = true;
        document.querySelector('input[value="controlled"]').checked = false;
        document.querySelector('input[value="held"]').checked = false;
        document.querySelector('input[value="other-episodes"]').checked = false;
        
        // Clear radio buttons
        const radioButtons = document.querySelectorAll('input[name="dateSort"]');
        radioButtons.forEach(radio => radio.checked = false);
        
        // Show all sections
        document.querySelector('.medications-section').style.display = 'block';
        document.querySelector('.prn-orders-section').style.display = 'block';
        document.querySelector('.action-orders-section').style.display = 'block';
        
        // Hide other episodes orders
        const otherEpisodesBodies = document.querySelectorAll('.other-episodes-orders-body');
        otherEpisodesBodies.forEach(tbody => {
            tbody.style.display = 'none';
        });
        
        // Show all orders
        showAllOrdersInVisibleSections();
        
        // Update chips
        renderActiveFilterChips();
    }

    function updateFilterDropdownText() {
        renderActiveFilterChips();
    }

    const filterChipMap = [
        { value: 'medications', label: 'Medications Scheduled' },
        { value: 'prn', label: 'PRN Medications' },
        { value: 'action', label: 'Action Orders' },
        { value: 'controlled', label: 'Controlled Substances' },
        { value: 'held', label: 'Held Orders' },
        { value: 'other-episodes', label: 'Historical Orders' }
    ];

    function renderActiveFilterChips() {
        const container = document.getElementById('activeFilterChips');
        if (!container) return;
        container.innerHTML = '';

        const medChecked = document.querySelector('input[value="medications"]')?.checked;
        const prnChecked = document.querySelector('input[value="prn"]')?.checked;
        const actionChecked = document.querySelector('input[value="action"]')?.checked;
        const controlledChecked = document.querySelector('input[value="controlled"]')?.checked;
        const heldChecked = document.querySelector('input[value="held"]')?.checked;
        const otherEpChecked = document.querySelector('input[value="other-episodes"]')?.checked;
        const allDefault = medChecked && prnChecked && actionChecked && !controlledChecked && !heldChecked && !otherEpChecked;

        filterChipMap.forEach(item => {
            const cb = document.querySelector(`input[type="checkbox"][value="${item.value}"]`);
            if (!cb || !cb.checked) return;
            if (allDefault && ['medications', 'prn', 'action'].includes(item.value)) return;

            const chip = document.createElement('span');
            chip.className = 'filter-chip';
            chip.innerHTML = `${item.label} <span class="chip-remove" data-filter="${item.value}">&times;</span>`;
            container.appendChild(chip);
        });

        const dateSort = document.querySelector('input[name="dateSort"]:checked');
        if (dateSort) {
            const label = dateSort.value === 'newest' ? 'Newest First' : 'Oldest First';
            const chip = document.createElement('span');
            chip.className = 'filter-chip';
            chip.innerHTML = `${label} <span class="chip-remove" data-filter="dateSort-${dateSort.value}">&times;</span>`;
            container.appendChild(chip);
        }

        container.querySelectorAll('.chip-remove').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const filterVal = this.getAttribute('data-filter');

                if (filterVal.startsWith('dateSort-')) {
                    const radio = document.querySelector(`input[name="dateSort"][value="${filterVal.replace('dateSort-', '')}"]`);
                    if (radio) radio.checked = false;
                } else {
                    const cb = document.querySelector(`input[type="checkbox"][value="${filterVal}"]`);
                    if (cb) cb.checked = false;
                }

                const medOn = document.querySelector('input[value="medications"]')?.checked;
                const prnOn = document.querySelector('input[value="prn"]')?.checked;
                const actOn = document.querySelector('input[value="action"]')?.checked;
                const ctrlOn = document.querySelector('input[value="controlled"]')?.checked;
                const heldOn = document.querySelector('input[value="held"]')?.checked;
                const otherOn = document.querySelector('input[value="other-episodes"]')?.checked;
                const dateOn = document.querySelector('input[name="dateSort"]:checked');
                const isDefault = medOn && prnOn && actOn && !ctrlOn && !heldOn && !otherOn && !dateOn;
                const noneChecked = !medOn && !prnOn && !actOn && !ctrlOn && !heldOn && !otherOn && !dateOn;

                if (isDefault || noneChecked) {
                    clearAllFilters();
                } else {
                    applyFilters();
                }
            });
        });
    }

    console.log('Kipu EMR prototype loaded successfully!');

    // Medication Order Modal functionality
    const customOrdersBtn = document.getElementById('customOrdersBtn');
    const medicationModal = document.getElementById('medicationModal');
    const closeModal = document.getElementById('closeModal');
    
    console.log('Modal elements found:', {
        customOrdersBtn: !!customOrdersBtn,
        medicationModal: !!medicationModal,
        closeModal: !!closeModal
    });
    
    // Quick Orders button functionality (placeholder)
    const quickOrdersBtn = document.getElementById('quickOrdersBtn');
    if (quickOrdersBtn) {
        quickOrdersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Quick Orders button clicked');
            alert('Quick Orders functionality would be implemented here.');
        });
    }

    // Medication Reconciliation Modal functionality
    const medReconciliationBtn = document.getElementById('medReconciliationBtn');
    const medReconciliationModal = document.getElementById('medReconciliationModal');
    const closeMedReconciliationModal = document.getElementById('closeMedReconciliationModal');
    const cancelMedReconciliation = document.getElementById('cancelMedReconciliation');
    const submitMedReconciliation = document.getElementById('submitMedReconciliation');
    const selectAllMedRecon = document.getElementById('selectAllMedRecon');
    const medReconCheckboxes = document.querySelectorAll('.med-recon-med-checkbox');

    if (medReconciliationBtn && medReconciliationModal) {
        medReconciliationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            medReconciliationModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMedReconModal() {
        if (medReconciliationModal) {
            medReconciliationModal.classList.remove('show');
            document.body.style.overflow = '';
            if (selectAllMedRecon) selectAllMedRecon.checked = false;
            medReconCheckboxes.forEach(cb => {
                cb.checked = false;
                cb.closest('.med-recon-row').classList.remove('selected');
            });
            document.querySelectorAll('.med-recon-row.expanded').forEach(r => r.classList.remove('expanded'));
            document.querySelectorAll('.med-recon-detail-row.show').forEach(r => r.classList.remove('show'));
        }
    }

    if (closeMedReconciliationModal) {
        closeMedReconciliationModal.addEventListener('click', closeMedReconModal);
    }

    if (cancelMedReconciliation) {
        cancelMedReconciliation.addEventListener('click', closeMedReconModal);
    }

    if (selectAllMedRecon) {
        selectAllMedRecon.addEventListener('change', function() {
            const isChecked = this.checked;
            medReconCheckboxes.forEach(cb => {
                cb.checked = isChecked;
                const row = cb.closest('.med-recon-row');
                if (row) {
                    row.classList.toggle('selected', isChecked);
                }
            });
        });
    }

    medReconCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const row = this.closest('.med-recon-row');
            if (row) {
                row.classList.toggle('selected', this.checked);
            }
            const allChecked = Array.from(medReconCheckboxes).every(c => c.checked);
            const someChecked = Array.from(medReconCheckboxes).some(c => c.checked);
            if (selectAllMedRecon) {
                selectAllMedRecon.checked = allChecked;
                selectAllMedRecon.indeterminate = someChecked && !allChecked;
            }
        });
    });

    if (submitMedReconciliation) {
        submitMedReconciliation.addEventListener('click', function() {
            const selected = Array.from(medReconCheckboxes).filter(cb => cb.checked);
            if (selected.length === 0) {
                alert('Please select at least one medication to reorder.');
                return;
            }
            const count = selected.length;
            alert(count + ' medication(s) submitted for reorder.');
            closeMedReconModal();
        });
    }

    if (medReconciliationModal) {
        medReconciliationModal.addEventListener('click', function(e) {
            if (e.target === medReconciliationModal) {
                closeMedReconModal();
            }
        });
    }

    // Expand/collapse medication detail rows
    document.querySelectorAll('.med-recon-row[data-detail]').forEach(function(row) {
        var medCell = row.querySelector('.med-recon-td-medication');
        if (medCell) {
            medCell.addEventListener('click', function(e) {
                if (e.target.tagName === 'INPUT') return;
                var detailId = row.getAttribute('data-detail');
                var detailRow = document.getElementById(detailId);
                if (detailRow) {
                    var isExpanded = row.classList.toggle('expanded');
                    detailRow.classList.toggle('show', isExpanded);
                }
            });
        }
    });

    // Show modal when Custom Orders button is clicked
    if (customOrdersBtn && medicationModal) {
        customOrdersBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            console.log('Custom Orders button clicked'); // Debug log
        medicationModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Reset modal to default state (Medication tab active, dosing sections visible)
        resetModalToDefault();
        
        // Initialize medication search functionality when modal opens
        setTimeout(() => {
                try {
            initializeMedicationSearch();
            initializeOutsideRxFunctionality();
                    console.log('Modal initialization functions called successfully');
                } catch (error) {
                    console.error('Error initializing modal functions:', error);
                }
        }, 100);
    });
    } else {
        console.error('Custom Orders button or modal not found:', {
            customOrdersBtn: !!customOrdersBtn,
            medicationModal: !!medicationModal
        });
    }
    
    // Hide modal when close button is clicked
    if (closeModal && medicationModal) {
    closeModal.addEventListener('click', function() {
        medicationModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
    }
    
    // Hide modal when clicking outside the modal container
    if (medicationModal) {
    medicationModal.addEventListener('click', function(e) {
        if (e.target === medicationModal) {
            medicationModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    }
    
    // Modal tab functionality
    const modalTabs = document.querySelectorAll('.modal-tab');
    const actionTabContent = document.getElementById('actionTabContent');
    const defaultModalContent = document.querySelector('.form-section');
    
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            modalTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Handle tab content switching
            const tabText = this.textContent.trim();
            
            // Find dosing sections to show/hide based on tab selection
            const expandableSections = document.querySelectorAll('.expandable-section');
            let maxDailyDoseSection = null;
            let criteriaBasedDosingSection = null;
            let shiftDosingSection = null;
            
            expandableSections.forEach(section => {
                const buttonText = section.querySelector('.expand-btn span')?.textContent || '';
                if (buttonText.includes('ADD MAX DAILY DOSE')) {
                    maxDailyDoseSection = section;
                } else if (buttonText.includes('ADD CRITERIA BASED DOSING')) {
                    criteriaBasedDosingSection = section;
                } else if (buttonText.includes('SHIFT DOSING')) {
                    shiftDosingSection = section;
                }
            });
            
            if (tabText === 'Action') {
                // Show Action Order form
                if (actionTabContent) {
                    actionTabContent.style.display = 'block';
                }
                if (defaultModalContent) {
                    defaultModalContent.style.display = 'none';
                }
                
                // Hide dosing sections for Action tab
                if (maxDailyDoseSection) {
                    maxDailyDoseSection.style.display = 'none';
                }
                if (criteriaBasedDosingSection) {
                    criteriaBasedDosingSection.style.display = 'none';
                }
                if (shiftDosingSection) {
                    shiftDosingSection.style.display = 'none';
                }
                
                // Update modal actions for Action tab
                const modalActions = document.querySelector('.modal-actions');
                if (modalActions) {
                    modalActions.style.display = 'none';
                }
            } else if (tabText === 'Taper') {
                // Show Taper tab content
                const taperTabContent = document.getElementById('taperTabContent');
                const titrationTabContent = document.getElementById('titrationTabContent');
                if (actionTabContent) {
                    actionTabContent.style.display = 'none';
                }
                if (defaultModalContent) {
                    defaultModalContent.style.display = 'none';
                }
                if (titrationTabContent) {
                    titrationTabContent.style.display = 'none';
                }
                if (taperTabContent) {
                    taperTabContent.style.display = 'block';
                }
                
                // Hide dosing sections for Taper tab
                if (maxDailyDoseSection) {
                    maxDailyDoseSection.style.display = 'none';
                }
                if (criteriaBasedDosingSection) {
                    criteriaBasedDosingSection.style.display = 'none';
                }
                if (shiftDosingSection) {
                    shiftDosingSection.style.display = 'none';
                }
                
                // Initialize Taper functionality
                initializeTaperTitrationSearch();
                initializeDosingSection();
                
                // Show modal actions for Taper tab
                const modalActions = document.querySelector('.modal-actions');
                if (modalActions) {
                    modalActions.style.display = 'flex';
                }
                
            } else if (tabText === 'Titration') {
                // Show Titration tab content
                const taperTabContent = document.getElementById('taperTabContent');
                const titrationTabContent = document.getElementById('titrationTabContent');
                if (actionTabContent) {
                    actionTabContent.style.display = 'none';
                }
                if (defaultModalContent) {
                    defaultModalContent.style.display = 'none';
                }
                if (taperTabContent) {
                    taperTabContent.style.display = 'none';
                }
                if (titrationTabContent) {
                    titrationTabContent.style.display = 'block';
                }
                
                // Hide dosing sections for Titration tab
                if (maxDailyDoseSection) {
                    maxDailyDoseSection.style.display = 'none';
                }
                if (criteriaBasedDosingSection) {
                    criteriaBasedDosingSection.style.display = 'none';
                }
                if (shiftDosingSection) {
                    shiftDosingSection.style.display = 'none';
                }
                
                // Initialize Titration functionality
                initializeTaperTitrationSearch();
                initializeDosingSection();
                
                // Show modal actions for Titration tab
                const modalActions = document.querySelector('.modal-actions');
                if (modalActions) {
                    modalActions.style.display = 'flex';
                }
                
            } else {
                // Show default medication content
                const taperTabContent = document.getElementById('taperTabContent');
                const titrationTabContent = document.getElementById('titrationTabContent');
                if (actionTabContent) {
                    actionTabContent.style.display = 'none';
                }
                if (taperTabContent) {
                    taperTabContent.style.display = 'none';
                }
                if (titrationTabContent) {
                    titrationTabContent.style.display = 'none';
                }
                if (defaultModalContent) {
                    defaultModalContent.style.display = 'block';
                }
                
                // Show dosing sections for Medication tab
                if (maxDailyDoseSection) {
                    maxDailyDoseSection.style.display = 'block';
                }
                if (criteriaBasedDosingSection) {
                    criteriaBasedDosingSection.style.display = 'block';
                }
                if (shiftDosingSection) {
                    shiftDosingSection.style.display = 'block';
                }
                
                // Show modal actions for other tabs
                const modalActions = document.querySelector('.modal-actions');
                if (modalActions) {
                    modalActions.style.display = 'flex';
                }
            }
        });
    });
    
    // Action Order form functionality
    const addActionBtn = document.querySelector('.btn-add-action');
    if (addActionBtn) {
        addActionBtn.addEventListener('click', function() {
            const actionInput = document.getElementById('actionInput');
            const startDate = document.getElementById('startDate');
            
            // Basic validation
            if (!actionInput.value.trim()) {
                alert('Please enter an action before adding.');
                actionInput.focus();
                return;
            }
            
            if (!startDate.value) {
                alert('Please select a start date.');
                startDate.focus();
                return;
            }
            
            // Collect selected measurements
            const selectedMeasurements = [];
            document.querySelectorAll('input[name="measurements"]:checked').forEach(checkbox => {
                selectedMeasurements.push(checkbox.value);
            });
            
            // Collect form data
            const formData = {
                action: actionInput.value.trim(),
                startDate: startDate.value,
                showInMedLog: document.getElementById('showInMedLog').value,
                prn: document.getElementById('prnCheckbox').checked,
                duration: document.getElementById('duration').value,
                justification: document.getElementById('justification').value,
                notes: document.getElementById('actionNotes').value,
                continueOnDischarge: document.getElementById('continueOnDischarge').checked,
                frequency: document.getElementById('frequency').value,
                measurements: selectedMeasurements
            };
            
            console.log('Action Order Data:', formData);
            
            // Show success message
            let measurementText = selectedMeasurements.length > 0 ? `\nMeasurements: ${selectedMeasurements.join(', ')}` : '';
            alert(`Action Order added successfully!\n\nAction: ${formData.action}\nStart Date: ${new Date(formData.startDate).toLocaleString()}\nPRN: ${formData.prn ? 'Yes' : 'No'}\nFrequency: ${formData.frequency || 'Not specified'}${measurementText}`);
            
            // Reset form
            resetActionForm();
        });
    }
    
    // Action measurement section expand/collapse functionality
    const actionExpandBtn = document.querySelector('.action-expand-btn');
    if (actionExpandBtn) {
        actionExpandBtn.addEventListener('click', function() {
            const content = document.querySelector('.action-measurement-content');
            const chevron = this.querySelector('i');
            const isExpanded = this.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                this.classList.remove('expanded');
                content.style.display = 'none';
                chevron.classList.remove('fa-chevron-up');
                chevron.classList.add('fa-chevron-down');
            } else {
                // Expand
                this.classList.add('expanded');
                content.style.display = 'block';
                chevron.classList.remove('fa-chevron-down');
                chevron.classList.add('fa-chevron-up');
            }
        });
    }
    
    function resetActionForm() {
        document.getElementById('actionInput').value = '';
        document.getElementById('startDate').value = '2025-09-03T10:00';
        document.getElementById('showInMedLog').value = '';
        document.getElementById('prnCheckbox').checked = false;
        document.getElementById('duration').value = '';
        document.getElementById('justification').value = '';
        document.getElementById('actionNotes').value = '';
        document.getElementById('continueOnDischarge').checked = false;
        document.getElementById('frequency').value = '';
        
        // Reset measurement checkboxes
        document.querySelectorAll('input[name="measurements"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset measurement section to collapsed state
        const expandBtn = document.querySelector('.action-expand-btn');
        const content = document.querySelector('.action-measurement-content');
        const chevron = expandBtn?.querySelector('i');
        
        if (expandBtn && content && chevron) {
            expandBtn.classList.remove('expanded');
            content.style.display = 'none';
            chevron.classList.remove('fa-chevron-up');
            chevron.classList.add('fa-chevron-down');
        }
    }
    
    function resetModalToDefault() {
        // Reset tabs to default state (Medication tab active)
        const modalTabs = document.querySelectorAll('.modal-tab');
        modalTabs.forEach(tab => tab.classList.remove('active'));
        
        // Set Medication tab as active
        const medicationTab = Array.from(modalTabs).find(tab => tab.textContent.trim() === 'Medication');
        if (medicationTab) {
            medicationTab.classList.add('active');
        }
        
        // Hide Action Order content and show default medication content
        const actionTabContent = document.getElementById('actionTabContent');
        const defaultModalContent = document.querySelector('.form-section');
        
        if (actionTabContent) {
            actionTabContent.style.display = 'none';
        }
        if (defaultModalContent) {
            defaultModalContent.style.display = 'block';
        }
        
        // Hide Taper and Titration content
        const taperTabContent = document.getElementById('taperTabContent');
        const titrationTabContent = document.getElementById('titrationTabContent');
        if (taperTabContent) {
            taperTabContent.style.display = 'none';
        }
        if (titrationTabContent) {
            titrationTabContent.style.display = 'none';
        }
        
        // Show all dosing sections (they should be visible for Medication tab)
        const expandableSections = document.querySelectorAll('.expandable-section');
        expandableSections.forEach(section => {
            const buttonText = section.querySelector('.expand-btn span')?.textContent || '';
            if (buttonText.includes('ADD MAX DAILY DOSE') || 
                buttonText.includes('ADD CRITERIA BASED DOSING') || 
                buttonText.includes('SHIFT DOSING')) {
                section.style.display = 'block';
            }
        });
        
        // Reset medication form checkboxes
        const medicationCheckboxes = ['erx', 'dispense', 'continue', 'prn', 'outsideRx', 'marCoSignature'];
        medicationCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = false;
            }
        });
        
        // Reset medication search input
        const medicationSearch = document.getElementById('medicationSearch');
        if (medicationSearch) {
            medicationSearch.value = '';
        }
        
        // Hide outside Rx fields if they were shown
        const outsideRxFields = document.getElementById('outsideRxFields');
        if (outsideRxFields) {
            outsideRxFields.style.display = 'none';
        }
        
        // Reset max daily dose fields
        const maxDailyDoseAmount = document.getElementById('maxDailyDoseAmount');
        const maxDailyDoseUnit = document.getElementById('maxDailyDoseUnit');
        
        if (maxDailyDoseAmount) {
            maxDailyDoseAmount.value = '';
            maxDailyDoseAmount.disabled = false;
        }
        if (maxDailyDoseUnit) {
            maxDailyDoseUnit.value = '';
            maxDailyDoseUnit.disabled = false;
        }
        
        // Show modal actions
        const modalActions = document.querySelector('.modal-actions');
        console.log('resetModalToDefault: modalActions found:', !!modalActions);
        if (modalActions) {
            modalActions.style.display = 'flex';
            console.log('resetModalToDefault: Set modal actions display to flex');
        } else {
            console.error('resetModalToDefault: modal-actions element not found!');
        }
    }
    
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
            // Collect medication form data including checkboxes
            const medicationData = {
                medication: document.getElementById('medicationSearch')?.value || '',
                eRx: document.getElementById('erx')?.checked || false,
                dispenseAsWritten: document.getElementById('dispense')?.checked || false,
                continueOnDischarge: document.getElementById('continue')?.checked || false,
                prn: document.getElementById('prn')?.checked || false,
                outsideRx: document.getElementById('outsideRx')?.checked || false,
                requiresMarCoSignature: document.getElementById('marCoSignature')?.checked || false
            };
            
            console.log('Medication Data:', medicationData);
            
            let checkboxOptions = [];
            if (medicationData.eRx) checkboxOptions.push('eRx');
            if (medicationData.dispenseAsWritten) checkboxOptions.push('Dispense as written');
            if (medicationData.continueOnDischarge) checkboxOptions.push('Continue on discharge');
            if (medicationData.prn) checkboxOptions.push('PRN');
            if (medicationData.outsideRx) checkboxOptions.push('Outside Rx');
            if (medicationData.requiresMarCoSignature) checkboxOptions.push('Requires MAR Co-Signature');
            
            let optionsText = checkboxOptions.length > 0 ? `\nOptions: ${checkboxOptions.join(', ')}` : '';
            alert(`Medication added to order list!\n\nMedication: ${medicationData.medication || 'Not specified'}${optionsText}`);
            
        } else if (e.target.classList.contains('btn-submit')) {
            alert('Submit functionality would save all medications and close the modal.');
            const medicationModal = document.getElementById('medicationModal');
            if (medicationModal) {
                medicationModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && medicationModal && medicationModal.classList.contains('show')) {
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
                                <th>Value</th>
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
                                    <input type="number" class="table-input" placeholder="Enter value" step="0.1" min="0">
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
            // Only show Condition, Value, Action, and Dose for subsequent rows
            newRow.innerHTML = `
                <td class="assessment-label">${firstAssessmentSelect.options[firstAssessmentSelect.selectedIndex].text}</td>
                <td>
                    <select class="table-select">
                        ${createConditionOptions()}
                    </select>
                </td>
                <td>
                    <input type="number" class="table-input" placeholder="Enter value" step="0.1" min="0">
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
                    <input type="number" class="table-input" placeholder="Enter value" step="0.1" min="0">
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

    // Discontinue Orders Modal functionality
    const discontinueOrdersBtn = document.getElementById('discontinueOrdersBtn');
    const discontinueModal = document.getElementById('discontinueModal');
    const closeDiscontinueModal = document.getElementById('closeDiscontinueModal');
    const cancelDiscontinue = document.getElementById('cancelDiscontinue');
    const submitDiscontinue = document.getElementById('submitDiscontinue');
    const selectAllDiscontinue = document.getElementById('selectAllDiscontinue');
    const discontinueMedCheckboxes = document.querySelectorAll('.discontinue-med-checkbox');
    
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
        // Clear form fields
        document.getElementById('discontinueReasonMain').value = '';
        document.getElementById('orderedBy').value = '';
        document.getElementById('via').value = '';
        
        // Uncheck all medication checkboxes
        selectAllDiscontinue.checked = false;
        discontinueMedCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            const medItem = checkbox.closest('.discontinue-med-item');
            if (medItem) {
                medItem.classList.remove('selected');
            }
        });
        
        // Reset submit button state
        validateDiscontinueForm();
    }
    
    // Select All Orders functionality
    selectAllDiscontinue.addEventListener('change', function() {
        const isChecked = this.checked;
        discontinueMedCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            const medItem = checkbox.closest('.discontinue-med-item');
            if (medItem) {
                if (isChecked) {
                    medItem.classList.add('selected');
                } else {
                    medItem.classList.remove('selected');
                }
            }
        });
        validateDiscontinueForm();
    });
    
    // Individual medication checkbox functionality
    discontinueMedCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const medItem = this.closest('.discontinue-med-item');
            if (medItem) {
                if (this.checked) {
                    medItem.classList.add('selected');
                } else {
                    medItem.classList.remove('selected');
                }
            }
            
            // Update "Select All" checkbox state
            const allChecked = Array.from(discontinueMedCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(discontinueMedCheckboxes).some(cb => cb.checked);
            selectAllDiscontinue.checked = allChecked;
            selectAllDiscontinue.indeterminate = someChecked && !allChecked;
            
            validateDiscontinueForm();
        });
    });
    
    // Form validation for discontinue modal
    // Requires Ordered by, Via fields, and at least one medication selected
    function validateDiscontinueForm() {
        const orderedBy = document.getElementById('orderedBy').value;
        const via = document.getElementById('via').value;
        const checkedMedications = document.querySelectorAll('.discontinue-med-checkbox:checked');
        const submitBtn = document.getElementById('submitDiscontinue');
        const discontinueAllBtn = document.getElementById('discontinueAllAndSubmit');
        
        // Enable submit button only if required fields are filled and at least one medication is selected
        const isValid = orderedBy && via && checkedMedications.length > 0;
        
        // Enable "Discontinue all and submit" button if required fields are filled (regardless of selection)
        const requiredFieldsFilled = orderedBy && via;
        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
        
        if (requiredFieldsFilled) {
            discontinueAllBtn.disabled = false;
            discontinueAllBtn.classList.remove('disabled');
        } else {
            discontinueAllBtn.disabled = true;
            discontinueAllBtn.classList.add('disabled');
        }
    }
    
    // Add event listeners for form validation
    document.getElementById('orderedBy').addEventListener('change', validateDiscontinueForm);
    document.getElementById('via').addEventListener('change', validateDiscontinueForm);
    document.getElementById('discontinueReasonMain').addEventListener('input', validateDiscontinueForm);
    
    // Submit discontinue form
    submitDiscontinue.addEventListener('click', function() {
        const discontinueReason = document.getElementById('discontinueReasonMain').value.trim();
        const orderedBy = document.getElementById('orderedBy').value;
        const via = document.getElementById('via').value;
        const checkedMedications = document.querySelectorAll('.discontinue-med-checkbox:checked');
        
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
            const label = checkbox.id
                ? document.querySelector(`label[for="${CSS.escape(checkbox.id)}"]`)
                : null;
            const text = label?.textContent?.trim()
                || (checkbox.nextElementSibling?.tagName === 'LABEL'
                    ? checkbox.nextElementSibling.textContent.trim()
                    : '');
            return text || 'Unknown medication';
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

    // Discontinue All and Submit button functionality
    const discontinueAllAndSubmit = document.getElementById('discontinueAllAndSubmit');
    discontinueAllAndSubmit.addEventListener('click', function() {
        const discontinueReason = document.getElementById('discontinueReasonMain').value.trim();
        const orderedBy = document.getElementById('orderedBy').value;
        const via = document.getElementById('via').value;
        const allMedicationCheckboxes = document.querySelectorAll('.discontinue-med-checkbox');
        
        if (!orderedBy || !via) {
            alert('Please fill in all required fields (Ordered by and Via).');
            return;
        }
        
        // Select all medications
        allMedicationCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Update select all checkbox
        const selectAllDiscontinue = document.getElementById('selectAllDiscontinue');
        if (selectAllDiscontinue) {
            selectAllDiscontinue.checked = true;
            selectAllDiscontinue.indeterminate = false;
        }
        
        // Collect all medications
        const allMedications = Array.from(allMedicationCheckboxes).map(checkbox => {
            const label = checkbox.id
                ? document.querySelector(`label[for="${CSS.escape(checkbox.id)}"]`)
                : null;
            const text = label?.textContent?.trim()
                || (checkbox.nextElementSibling?.tagName === 'LABEL'
                    ? checkbox.nextElementSibling.textContent.trim()
                    : '');
            return text || 'Unknown medication';
        });
        
        // Simulate discontinue order submission for all medications
        const discontinueData = {
            medications: allMedications,
            reason: discontinueReason,
            orderedBy: orderedBy,
            via: via,
            timestamp: new Date().toISOString()
        };
        
        console.log('Discontinue ALL orders submitted:', discontinueData);
        
        // Show success message
        alert(`Successfully discontinued ALL ${allMedications.length} medication(s):\n\n${allMedications.join('\n')}\n\nReason: ${discontinueReason || 'Not specified'}\nOrdered by: ${orderedBy}\nVia: ${via}`);
        
        // Close modal and reset form
        closeDiscontinueModalHandler();
    });

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
        
        // Uncheck Select All checkbox
        const selectAllCheckbox = document.getElementById('selectAllContinueMeds');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }
        
        // Clear form fields
        document.getElementById('continueOrderedBy').value = '';
        document.getElementById('continueVia').value = '';
        
        // Reset submit button state
        validateContinueDischargeForm();
        
        // Reset medication item styling
        const medicationItems = document.querySelectorAll('.continue-discharge-modal .medication-item');
        medicationItems.forEach(item => {
            item.classList.remove('selected');
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
    
    // Select All functionality for Continue on Discharge modal
    const selectAllContinueMeds = document.getElementById('selectAllContinueMeds');
    const continueCheckboxes = document.querySelectorAll('.med-checkbox-continue');
    
    if (selectAllContinueMeds) {
        selectAllContinueMeds.addEventListener('change', function() {
            const isChecked = this.checked;
            
            continueCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const medicationItem = checkbox.closest('.medication-item');
                if (isChecked) {
                    medicationItem.classList.add('selected');
                } else {
                    medicationItem.classList.remove('selected');
                }
            });
            
            validateContinueDischargeForm();
        });
    }
    
    // Update Select All checkbox state when individual checkboxes change
    function updateContinueSelectAllState() {
        const allCheckboxes = document.querySelectorAll('.med-checkbox-continue');
        const checkedCheckboxes = document.querySelectorAll('.med-checkbox-continue:checked');
        const selectAllCheckbox = document.getElementById('selectAllContinueMeds');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = allCheckboxes.length > 0 && allCheckboxes.length === checkedCheckboxes.length;
        }
    }
    
    // Add event listeners for form validation
    document.getElementById('continueOrderedBy').addEventListener('change', validateContinueDischargeForm);
    document.getElementById('continueVia').addEventListener('change', validateContinueDischargeForm);
    
    // Add event listeners for medication checkboxes
    continueCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            validateContinueDischargeForm();
            
            // Visual feedback for selected medications
            const medicationItem = this.closest('.medication-item');
            if (this.checked) {
                medicationItem.classList.add('selected');
            } else {
                medicationItem.classList.remove('selected');
            }
            
            // Update Select All checkbox state
            updateContinueSelectAllState();
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
            const label = checkbox.id
                ? document.querySelector(`label[for="${CSS.escape(checkbox.id)}"]`)
                : null;
            const text = label?.textContent?.trim()
                || (checkbox.nextElementSibling?.tagName === 'LABEL'
                    ? checkbox.nextElementSibling.textContent.trim()
                    : '');
            return text || 'Unknown medication';
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
    const medsbroughtInBtn = document.getElementById('medsBroughtInBtn'); // MEDS BROUGHT IN button
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
            
            // Reset filter button active state to "MEDICATION RECONCILIATION"
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            const medReconBtn = document.getElementById('medReconciliationBtn');
            if (medReconBtn) {
                medReconBtn.classList.add('active');
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

// Order History Functions
function toggleOrderHistory(historyId) {
    console.log('toggleOrderHistory called with:', historyId);
    const historyRow = document.getElementById(historyId);
    if (!historyRow) {
        console.error('History row not found:', historyId);
        return;
    }
    
    // Find the corresponding expand icon (both left and right side)
    const expandIcon = document.querySelector(`[onclick="toggleOrderHistory('${historyId}')"]`);
    
    console.log('Current display style:', historyRow.style.display);
    const isVisible = historyRow.style.display === 'table-row';
    
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

// Make all toggle functions globally available
window.toggleOrderHistory = toggleOrderHistory;
window.toggleHistorySection = toggleHistorySection;
window.toggleOrderStatus = toggleOrderStatus;

// Hold Order Modal Functionality

let currentHoldOrderRow = null;

function openHoldOrderModal(medicationName, instructions, orderRow) {
    console.log('NEW VERSION: openHoldOrderModal called with:', medicationName, instructions);
    currentHoldOrderRow = orderRow;
    const modal = document.getElementById('holdOrderModal');
    const nameElement = document.getElementById('holdOrderMedicationName');
    const instructionsElement = document.getElementById('holdOrderMedicationInstructions');
    
    console.log('Modal element:', modal);
    console.log('Name element:', nameElement);
    console.log('Instructions element:', instructionsElement);
    
    if (!modal) {
        console.error('Hold Order Modal not found!');
        return;
    }
    
    if (!nameElement || !instructionsElement) {
        console.error('Modal elements not found!', {nameElement, instructionsElement});
        return;
    }
    
    // Set medication info
    nameElement.textContent = medicationName;
    instructionsElement.textContent = instructions;
    
    // Initialize date/time inputs with current date/time
    initializeDateTimeInputs();
    
    // Reset form
    resetHoldOrderForm();
    
    // Show modal
    console.log('Showing modal...');
    modal.classList.add('show');
    console.log('Modal classes after adding show:', modal.className);
}

function initializeDateTimeInputs() {
    const now = new Date();
    const startDateInput = document.getElementById('holdStartDate');
    const startTimeInput = document.getElementById('holdStartTime');
    const endDateInput = document.getElementById('holdEndDate');
    const endTimeInput = document.getElementById('holdEndTime');
    
    if (startDateInput && startTimeInput && endDateInput && endTimeInput) {
        // Set start date/time to current date/time
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);
        
        startDateInput.value = currentDate;
        startTimeInput.value = currentTime;
        
        // Set end date/time to 24 hours later by default
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];
        
        endDateInput.value = tomorrowDate;
        endTimeInput.value = currentTime;
        
        // Set minimum date/time to current date/time
        startDateInput.min = currentDate;
        endDateInput.min = currentDate;
    }
}

function resetHoldOrderForm() {
    // Reset date/time inputs to defaults
    initializeDateTimeInputs();
    
    // Reset radio buttons to indefinite hold
    const holdIndefiniteEl = document.getElementById('holdIndefinite');
    if (holdIndefiniteEl) holdIndefiniteEl.checked = true;
    
    // Reset text area
    const holdReasonEl = document.getElementById('holdOrderReason');
    if (holdReasonEl) holdReasonEl.value = '';
}

// Hold Order Modal Event Listeners
const holdOrderModal = document.getElementById('holdOrderModal');
const closeHoldOrderModal = document.getElementById('closeHoldOrderModal');
const cancelHoldOrder = document.getElementById('cancelHoldOrder');
const submitHoldOrder = document.getElementById('submitHoldOrder');

// Preset buttons
const presetButtons = document.querySelectorAll('.preset-btn');

// Duration radio buttons
const holdIndefinite = document.getElementById('holdIndefinite');

if (closeHoldOrderModal) {
    closeHoldOrderModal.addEventListener('click', () => {
        holdOrderModal.classList.remove('show');
        currentHoldOrderRow = null;
    });
}

if (cancelHoldOrder) {
    cancelHoldOrder.addEventListener('click', () => {
        holdOrderModal.classList.remove('show');
        currentHoldOrderRow = null;
    });
}

// Preset button functionality
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        applyDateTimePreset(preset);
    });
});

function applyDateTimePreset(preset) {
    const now = new Date();
    const startDateInput = document.getElementById('holdStartDate');
    const startTimeInput = document.getElementById('holdStartTime');
    const endDateInput = document.getElementById('holdEndDate');
    const endTimeInput = document.getElementById('holdEndTime');
    
    if (!startDateInput || !startTimeInput || !endDateInput || !endTimeInput) return;
    
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    switch (preset) {
        case 'next-24h':
            startDateInput.value = currentDate;
            startTimeInput.value = currentTime;
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            endDateInput.value = tomorrow.toISOString().split('T')[0];
            endTimeInput.value = currentTime;
            break;
            
        case 'next-dose':
            startDateInput.value = currentDate;
            startTimeInput.value = currentTime;
            const nextDose = new Date(now);
            nextDose.setHours(nextDose.getHours() + 8); // Assume next dose in 8 hours
            endDateInput.value = nextDose.toISOString().split('T')[0];
            endTimeInput.value = nextDose.toTimeString().slice(0, 5);
            break;
            
        case 'today':
            startDateInput.value = currentDate;
            startTimeInput.value = currentTime;
            endDateInput.value = currentDate;
            endTimeInput.value = '23:59';
            break;
            
        case 'tomorrow':
            const tomorrowStart = new Date(now);
            tomorrowStart.setDate(tomorrowStart.getDate() + 1);
            tomorrowStart.setHours(0, 0, 0, 0);
            const tomorrowEnd = new Date(tomorrowStart);
            tomorrowEnd.setHours(23, 59, 0, 0);
            
            startDateInput.value = tomorrowStart.toISOString().split('T')[0];
            startTimeInput.value = '00:00';
            endDateInput.value = tomorrowEnd.toISOString().split('T')[0];
            endTimeInput.value = '23:59';
            break;
            
        case 'weekend':
            const friday = new Date(now);
            const daysUntilFriday = (5 - friday.getDay() + 7) % 7;
            friday.setDate(friday.getDate() + daysUntilFriday);
            friday.setHours(17, 0, 0, 0); // 5 PM Friday
            
            const sunday = new Date(friday);
            sunday.setDate(sunday.getDate() + 2);
            sunday.setHours(23, 59, 0, 0); // 11:59 PM Sunday
            
            startDateInput.value = friday.toISOString().split('T')[0];
            startTimeInput.value = '17:00';
            endDateInput.value = sunday.toISOString().split('T')[0];
            endTimeInput.value = '23:59';
            break;
    }
}


if (submitHoldOrder) {
    submitHoldOrder.addEventListener('click', () => {
        // Validate form
        const reason = document.getElementById('holdOrderReason').value.trim();
        if (!reason) {
            alert('Please provide a reason for holding this order.');
            return;
        }
        
        // Get date/time range
        const startDate = document.getElementById('holdStartDate').value;
        const startTime = document.getElementById('holdStartTime').value;
        const endDate = document.getElementById('holdEndDate').value;
        const endTime = document.getElementById('holdEndTime').value;
        
        // Validate date/time range
        if (!startDate || !startTime || !endDate || !endTime) {
            alert('Please provide complete start and end date/time for the hold.');
            return;
        }
        
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        
        if (endDateTime <= startDateTime) {
            alert('End date/time must be after start date/time.');
            return;
        }
        
        // Get duration (always indefinite now)
        const duration = 'indefinite';
        
        // Create hold order data
        const holdData = {
            medicationName: document.getElementById('holdOrderMedicationName').textContent,
            reason: reason,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            duration: duration,
            timestamp: new Date().toISOString()
        };
        
        // In a real application, this would be sent to the server
        console.log('Hold Order Data:', holdData);
        
        // Show confirmation message
        let message = `Order successfully placed on hold:\n\n`;
        message += `Medication: ${holdData.medicationName}\n`;
        message += `Reason: ${holdData.reason}\n\n`;
        
        // Format date/time range for display
        const formatDateTime = (date) => {
            return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        };
        
        message += `Hold Period:\n`;
        message += `From: ${formatDateTime(startDateTime)}\n`;
        message += `To: ${formatDateTime(endDateTime)}\n`;
        message += `Duration: Hold indefinitely (until manually resumed)\n`;
        
        message += `\nThis order will not be administered according to the specified hold parameters.`;
        
        alert(message);
        
        // Close modal
        holdOrderModal.classList.remove('show');
        currentHoldOrderRow = null;
    });
}

// Close modal when clicking outside
if (holdOrderModal) {
    holdOrderModal.addEventListener('click', (e) => {
        if (e.target === holdOrderModal) {
            holdOrderModal.classList.remove('show');
            currentHoldOrderRow = null;
        }
    });
}

// Nurse Review Modal Functionality
(function() {
    let currentNurseReviewCheckbox = null;
    let nurseReviewModal = null;

    // Handle nurse review checkbox clicks
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        
        const checkbox = e.target.closest('.nurse-review-checkbox.pending');
        console.log('Checkbox found:', checkbox);
        
        if (checkbox && !checkbox.classList.contains('reviewed')) {
            e.preventDefault();
            e.stopPropagation();
            currentNurseReviewCheckbox = checkbox;
            
            console.log('Opening nurse review modal...');
            
            // Get modal element
            nurseReviewModal = document.getElementById('nurseReviewModal');
            console.log('Modal element:', nurseReviewModal);
            
            // Get order details from the row
            const row = checkbox.closest('tr');
            const orderName = row?.querySelector('.medication-header')?.textContent || 'Order';
            const orderInstructions = row?.querySelector('.medication-instructions')?.textContent || '';
            
            // Combine name and instructions for display
            const fullOrderDetails = orderInstructions ? `${orderName}, ${orderInstructions.replace('Take ', '')}` : orderName;
            console.log('Order details:', fullOrderDetails);
            
            // Update modal content
            const orderDetailsEl = document.getElementById('reviewOrderDetails');
            
            if (orderDetailsEl) orderDetailsEl.textContent = fullOrderDetails;
            
            // Show modal
            if (nurseReviewModal) {
                nurseReviewModal.classList.add('show');
                nurseReviewModal.style.display = 'flex';
                console.log('Modal should be visible now');
            } else {
                console.error('Modal element not found!');
            }
        }
    });

    // Close nurse review modal - using event delegation
    document.addEventListener('click', function(e) {
        nurseReviewModal = document.getElementById('nurseReviewModal');
        
        // Close button
        if (e.target.id === 'closeNurseReviewModal' || e.target.closest('#closeNurseReviewModal')) {
            if (nurseReviewModal) {
                nurseReviewModal.classList.remove('show');
                nurseReviewModal.style.display = 'none';
                currentNurseReviewCheckbox = null;
            }
        }
        
        // Cancel button
        if (e.target.id === 'cancelNurseReview' || e.target.closest('#cancelNurseReview')) {
            if (nurseReviewModal) {
                nurseReviewModal.classList.remove('show');
                nurseReviewModal.style.display = 'none';
                currentNurseReviewCheckbox = null;
            }
        }
        
        // Confirm button
        if (e.target.id === 'confirmNurseReview' || e.target.closest('#confirmNurseReview')) {
            if (currentNurseReviewCheckbox) {
                const now = new Date();
                const formattedDate = now.toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit', 
                    year: 'numeric' 
                });
                const formattedTime = now.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                // Update checkbox state
                currentNurseReviewCheckbox.classList.remove('pending');
                currentNurseReviewCheckbox.classList.add('reviewed');
                
                const input = currentNurseReviewCheckbox.querySelector('.nurse-review-input');
                const label = currentNurseReviewCheckbox.querySelector('.nurse-review-label');
                
                if (input) {
                    input.checked = true;
                    input.disabled = true;
                }
                if (label) {
                    label.textContent = 'Nurse Reviewed';
                }
                
                // Show reviewer info
                const reviewedByDiv = currentNurseReviewCheckbox.closest('.nurse-review-combined').querySelector('.reviewed-by');
                if (reviewedByDiv) {
                    reviewedByDiv.style.display = 'block';
                    const nameEl = reviewedByDiv.querySelector('.reviewer-name') || reviewedByDiv.querySelector('div:first-child');
                    const dateEl = reviewedByDiv.querySelector('.review-date') || reviewedByDiv.querySelector('div:last-child');
                    
                    if (nameEl) nameEl.textContent = 'Current User';
                    if (dateEl) dateEl.textContent = `${formattedDate} ${formattedTime}`;
                }
            }
            
            if (nurseReviewModal) {
                nurseReviewModal.classList.remove('show');
                nurseReviewModal.style.display = 'none';
            }
            currentNurseReviewCheckbox = null;
        }
        
        // Click outside modal to close
        if (e.target === nurseReviewModal) {
            nurseReviewModal.classList.remove('show');
            nurseReviewModal.style.display = 'none';
            currentNurseReviewCheckbox = null;
        }
    });
})();

// Doctor Orders History - Handle clicks on medication links
document.addEventListener('click', function(e) {
    // Check if clicked element is a medication order in Doctor Orders History
    if (e.target.classList.contains('history-order') && 
        e.target.closest('[id^="doctor-orders"]')) {
        
        const medicationText = e.target.textContent;
        const historySection = e.target.closest('[id^="doctor-orders"]');
        const medicationName = historySection.id.replace('doctor-orders-', '');
        
        // Simulate navigation to order details
        console.log('Navigating to order details for:', medicationText);
        
        // Show a placeholder alert (in a real app, this would navigate to order details page)
        alert(`Order Details\n\nMedication: ${medicationText}\n\nThis would normally take you to the detailed order information page with:\n\n• Full prescription details\n• Prescriber information\n• Order history\n• Administration schedule\n• Clinical notes\n• Approval status`);
    }
});

// Frequency Details Toggle Function
function toggleFrequencyDetails(frequencyId) {
    const content = document.getElementById(frequencyId);
    const button = document.querySelector(`[onclick="toggleFrequencyDetails('${frequencyId}')"]`);
    
    if (content && button) {
        const isVisible = content.style.display !== 'none';
        
        if (isVisible) {
            content.style.display = 'none';
            button.classList.remove('expanded');
        } else {
            content.style.display = 'block';
            button.classList.add('expanded');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const doctorOrdersToggle = document.getElementById('doctorOrdersToggle');
    if (doctorOrdersToggle) {
        const syncDoctorOrdersSwitchLabel = function (input) {
            if (!input) return;
            input.setAttribute(
                'aria-label',
                input.checked
                    ? 'New Doctor Orders. Press to use Legacy Doctor Orders'
                    : 'Legacy Doctor Orders. Press to use New Doctor Orders'
            );
        };
        syncDoctorOrdersSwitchLabel(doctorOrdersToggle);
        doctorOrdersToggle.addEventListener('change', function() {
            const legacyLabel = document.getElementById('legacyLabel');
            const newLabel = document.getElementById('newLabel');
            syncDoctorOrdersSwitchLabel(this);
            if (this.checked) {
                newLabel.classList.add('active');
                legacyLabel.classList.remove('active');
            } else {
                legacyLabel.classList.add('active');
                newLabel.classList.remove('active');
            }
        });
    }
});

function toggleMeasurementsPanel() {
    const panel = document.getElementById('measurementsPanel');
    if (panel) {
        panel.classList.toggle('expanded');
    }
}

// Hold Management Functions
function stopHold(medicationName, holdId) {
    const confirmed = confirm(`Are you sure you want to stop the hold for ${medicationName}?\n\nThis will immediately resume the medication order.`);
    
    if (confirmed) {
        console.log(`Stopping hold for ${medicationName}, ID: ${holdId}`);
        
        // Show success message
        alert(`Hold stopped successfully!\n\nMedication: ${medicationName}\nHold ID: ${holdId}\n\nThe medication order has been resumed and will follow the normal administration schedule.`);
        
        // In a real application, this would update the database and refresh the UI
        // For now, we'll just log the action
        console.log('Hold stopped - would update database and refresh UI in real application');
    }
}

function editHold(medicationName, holdId) {
    console.log(`Editing hold for ${medicationName}, ID: ${holdId}`);
    
    // Show placeholder for edit functionality
    alert(`Edit Hold Feature\n\nMedication: ${medicationName}\nHold ID: ${holdId}\n\nThis would open the hold editor where you could modify:\n\n• Hold dates and times\n• Reason for hold\n• Duration settings\n• Additional notes\n\nFeature coming soon!`);
    
    // In a real application, this would open the hold edit modal
    console.log('Edit hold - would open edit modal in real application');
}

// Trend Analysis Functions
function openTrendAnalysisModal(medicationName) {
    const modal = document.getElementById('trendAnalysisModal');
    const medicationNameEl = document.getElementById('trendMedicationName');
    const medicationDoseEl = document.getElementById('trendMedicationDose');
    
    if (!modal) {
        return;
    }
    
    // Update medication info based on the selected medication
    const medicationData = {
        'xanax': {
            name: 'Xanax (alprazolam)',
            dose: '0.5 mg tablet',
            compliance: '89.7%',
            dosesTaken: '26 of 29',
            onTime: '78.3%',
            avgDelay: '12 minutes'
        },
        'amoxicillin': {
            name: 'Amoxicillin',
            dose: '500 mg capsule',
            compliance: '94.2%',
            dosesTaken: '82 of 87',
            onTime: '91.5%',
            avgDelay: '8 minutes'
        },
        'lisinopril': {
            name: 'Lisinopril',
            dose: '10 mg tablet',
            compliance: '96.8%',
            dosesTaken: '29 of 30',
            onTime: '93.1%',
            avgDelay: '5 minutes'
        }
    };
    
    const data = medicationData[medicationName] || medicationData['xanax'];
    
    if (medicationNameEl) medicationNameEl.textContent = data.name;
    if (medicationDoseEl) medicationDoseEl.textContent = data.dose;
    
    // Update statistics with medication-specific data
    updateTrendStatistics(data);
    
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Render the trend chart after modal is displayed
    setTimeout(() => {
        renderTrendChart();
    }, 100);
}

function closeTrendAnalysisModal() {
    const modal = document.getElementById('trendAnalysisModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

function updateTrendStatistics(data) {
    // Update compliance value
    const complianceValue = document.querySelector('.stat-card .stat-value.compliance-high');
    if (complianceValue) {
        complianceValue.textContent = data.compliance;
    }
    
    // Update doses taken
    const dosesTakenValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (dosesTakenValue) {
        dosesTakenValue.textContent = data.dosesTaken;
    }
    
    // Update on-time administration
    const onTimeValue = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (onTimeValue) {
        onTimeValue.textContent = data.onTime;
    }
    
    // Update average delay
    const avgDelayValue = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (avgDelayValue) {
        avgDelayValue.textContent = data.avgDelay;
    }
}

function updateTrendAnalysis() {
    const period = document.getElementById('trendPeriod');
    if (!period) return;
    
    // Re-render the chart with updated time period
    setTimeout(() => {
        renderTrendChart();
    }, 100);
}

function exportTrendAnalysis() {
    const medicationName = document.getElementById('trendMedicationName')?.textContent || 'Unknown Medication';
    const period = document.getElementById('trendPeriod')?.value || '30';
    
    // Create a simple text report (in real app, this would generate PDF/Excel)
    const reportData = `
MEDICATION TREND ANALYSIS REPORT
================================

Medication: ${medicationName}
Analysis Period: Last ${period} days
Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

COMPLIANCE SUMMARY:
- Overall Compliance: 89.7%
- Doses Taken: 26 of 29
- On-Time Administration: 78.3%
- Average Delay: 12 minutes

PATTERNS:
- Most Common Time: 6:15 PM (87% of doses)
- Best Compliance Day: Tuesday (96%)
- Lowest Compliance Day: Saturday (82%)

CLINICAL INSIGHTS:
- Good adherence pattern with consistent compliance
- Weekend compliance needs attention
- Timing consistency is maintained

Generated by Kipu EMR System
    `;
    
    // Create a downloadable file
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trend-analysis-${medicationName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert(`Trend Analysis Report Exported!\n\nMedication: ${medicationName}\nPeriod: Last ${period} days\n\nThe report has been downloaded to your device.`);
}

// Chart rendering function
function renderTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) {
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Chart dimensions - optimized padding for compact layout
    const width = rect.width;
    const height = rect.height;
    const padding = 60; // Reduced padding for more compact layout
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Sample data similar to reference chart
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Taken (Yes)',
                data: [45, 47, 44, 46, 43, 48, 45, 46, 44, 45],
                color: '#ff9500',
                lineWidth: 3
            },
            {
                label: 'Not Taken (No)',
                data: [2, 1, 3, 2, 4, 1, 2, 2, 3, 2],
                color: '#5dade2',
                lineWidth: 3
            },
            {
                label: 'Refused',
                data: [1, 2, 1, 1, 2, 1, 2, 1, 2, 1],
                color: '#48c9b0',
                lineWidth: 3
            },
            {
                label: 'Held',
                data: [2, 0, 2, 1, 1, 0, 1, 1, 1, 2],
                color: '#58d68d',
                lineWidth: 3
            }
        ]
    };
    
    const maxY = 50;
    const minY = 0;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (i * chartWidth / 10);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i * chartHeight / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 5; i++) {
        const value = maxY - (i * 10);
        const y = padding + (i * chartHeight / 5);
        ctx.fillText(value.toString(), padding - 12, y);
    }
    
    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i < data.labels.length; i++) {
        const x = padding + ((i + 0.5) * chartWidth / data.labels.length);
        ctx.fillText(data.labels[i], x, padding + chartHeight + 12);
    }
    
    // Draw axis titles
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px sans-serif';
    
    // Y-axis title
    ctx.save();
    ctx.translate(20, padding + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Number of Doses', 0, 0);
    ctx.restore();
    
    // X-axis title
    ctx.textAlign = 'center';
    ctx.fillText('Day', padding + chartWidth / 2, height - 20);
    
    // Draw data lines
    data.datasets.forEach(dataset => {
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = dataset.lineWidth;
        ctx.beginPath();
        
        for (let i = 0; i < dataset.data.length; i++) {
            const x = padding + ((i + 0.5) * chartWidth / dataset.data.length);
            const y = padding + chartHeight - (dataset.data[i] / maxY * chartHeight);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = dataset.color;
        for (let i = 0; i < dataset.data.length; i++) {
            const x = padding + ((i + 0.5) * chartWidth / dataset.data.length);
            const y = padding + chartHeight - (dataset.data[i] / maxY * chartHeight);
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI); // Increased point size from 4 to 5
            ctx.fill();
            
            // White border around points
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

// Close trend analysis modal when clicking outside
window.addEventListener('click', function(event) {
    const trendModal = document.getElementById('trendAnalysisModal');
    if (event.target === trendModal) {
        closeTrendAnalysisModal();
    }
});

// MedLog specific functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleHelp() {
    alert('Help functionality would be implemented here. This prototype shows the MedLog interface matching your design requirements.');
}

// Humalog Modal Functions
function openHumalogModal(time) {
    const modal = document.getElementById('humalogModal');
    const modalDateTime = document.getElementById('modalDateTime');
    
    // Update the date/time based on clicked card - keep original format with leading zeros
    const currentDate = '09/29/2025';
    const formattedTime = time.replace(/^(\d):/, '0$1:'); // Add leading zero if needed
    modalDateTime.textContent = `${currentDate} ${formattedTime}`;
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeHumalogModal() {
    const modal = document.getElementById('humalogModal');
    
    // Hide modal
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Reset form
    resetHumalogModal();
}

function resetHumalogModal() {
    // Reset radio buttons
    const radioNo = document.querySelector('#takenNo');
    const checkboxRefused = document.querySelector('#refused');
    const commentTextarea = document.querySelector('.humalog-textarea');
    const quantityDisplay = document.getElementById('humalogQuantity');
    
    if (radioNo) radioNo.checked = true;
    if (checkboxRefused) checkboxRefused.checked = false;
    if (commentTextarea) commentTextarea.value = '';
    if (quantityDisplay) {
        quantityDisplay.textContent = '1 Unit';
        quantityDisplay.className = 'humalog-value';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('humalogModal');
    if (event.target === modal) {
        closeHumalogModal();
    }
});

// Prevent card checkbox from triggering modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('time-checkbox')) {
        e.stopPropagation();
    }
});

// Glucose Drawer Functions
function openGlucoseDrawer(event) {
    event.preventDefault();
    
    const drawer = document.getElementById('glucoseDrawer');
    drawer.classList.add('open');
}

function closeGlucoseDrawer() {
    const drawer = document.getElementById('glucoseDrawer');
    drawer.classList.remove('open');
    
    // Reset form
    resetGlucoseDrawer();
}

function resetGlucoseDrawer() {
    // Reset form fields
    const readingInput = document.querySelector('.glucose-reading-input');
    const checkDropdown = document.querySelector('.glucose-check-dropdown');
    const interventionCheckboxes = document.querySelectorAll('.glucose-checkbox-item input[type="checkbox"]');
    const commentsTextarea = document.querySelector('.glucose-comments');
    
    if (readingInput) readingInput.value = '';
    if (checkDropdown) checkDropdown.selectedIndex = 0;
    if (commentsTextarea) commentsTextarea.value = '';
    
    interventionCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Calculate glucose dose based on reading and criteria-based dosing rules
function calculateGlucoseDose() {
    const readingInput = document.getElementById('glucoseReading');
    const quantityDisplay = document.getElementById('humalogQuantity');
    
    if (!readingInput || !quantityDisplay) return;
    
    const reading = parseFloat(readingInput.value);
    
    // Clear previous classes
    quantityDisplay.className = 'humalog-value';
    
    if (isNaN(reading) || reading === '') {
        // Reset to default when no reading
        quantityDisplay.textContent = '1 Unit';
        return;
    }
    
    // Apply criteria-based dosing logic
    if (reading < 70) {
        quantityDisplay.textContent = 'Do not administer (Glucose: ' + reading + ')';
        quantityDisplay.classList.add('do-not-administer');
    } else if (reading >= 70 && reading <= 150) {
        quantityDisplay.textContent = '2 units (Glucose: ' + reading + ')';
        quantityDisplay.classList.add('administer');
    } else if (reading >= 151 && reading <= 200) {
        quantityDisplay.textContent = '4 units (Glucose: ' + reading + ')';
        quantityDisplay.classList.add('administer');
    } else if (reading > 200) {
        // Handle readings above 200 (not specified in criteria, but good to have)
        quantityDisplay.textContent = 'Consult physician (Glucose: ' + reading + ')';
        quantityDisplay.classList.add('do-not-administer');
    }
}

// Close drawer when clicking outside
document.addEventListener('click', function(event) {
    const drawer = document.getElementById('glucoseDrawer');
    const glucoseLink = document.querySelector('.glucose-link');
    
    if (drawer && drawer.classList.contains('open') && 
        !drawer.contains(event.target) && 
        event.target !== glucoseLink) {
        closeGlucoseDrawer();
    }
});

// Taper and Titration Instruction Builder Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeInstructionBuilder();
    initializeTaperTitrationSearch();
    initializeRouteAutopopulation();
    initializeDosingSection();
    
    // Also initialize dosing sections when tabs are switched
    initializeTabSwitching();
});

function initializeTabSwitching() {
    // Listen for tab clicks to reinitialize dosing sections
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-link') && 
            (e.target.textContent.includes('Taper') || e.target.textContent.includes('Titration'))) {
            
            console.log('Tab switched to:', e.target.textContent);
            // Wait a bit for the tab content to be visible
            setTimeout(() => {
                initializeDosingSection();
            }, 100);
        }
    });
}

function initializeInstructionBuilder() {
    // Handle frequency changes to show/hide time inputs
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('frequency-select')) {
            handleFrequencyChange(e.target);
        }
        
        if (e.target.classList.contains('dose-select')) {
            handleDoseChange(e.target);
        }
    });
    
    // Handle add/remove instruction buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-instruction')) {
            addInstructionRow(e.target);
        }
        
        if (e.target.classList.contains('btn-remove-instruction')) {
            removeInstructionRow(e.target);
        }
    });
}

function handleFrequencyChange(selectElement) {
    const instructionFields = selectElement.closest('.instruction-fields');
    const timesGroup = instructionFields.querySelector('.times-group');
    const timeInputs = timesGroup.querySelectorAll('.time-input');
    const frequency = selectElement.value;
    
    // Hide all time inputs first
    timeInputs.forEach(input => input.style.display = 'none');
    
    // Show times group and appropriate number of time inputs based on frequency
    switch(frequency) {
        case 'once daily':
            timesGroup.style.display = 'block';
            timeInputs[0].style.display = 'block';
            break;
        case 'twice daily':
            timesGroup.style.display = 'block';
            timeInputs[0].style.display = 'block';
            timeInputs[1].style.display = 'block';
            break;
        case 'three times daily':
            timesGroup.style.display = 'block';
            timeInputs[0].style.display = 'block';
            timeInputs[1].style.display = 'block';
            timeInputs[2].style.display = 'block';
            break;
        case 'four times daily':
            timesGroup.style.display = 'block';
            timeInputs.forEach(input => input.style.display = 'block');
            break;
        default:
            timesGroup.style.display = 'none';
            break;
    }
}

function handleDoseChange(selectElement) {
    const fieldGroup = selectElement.closest('.field-group');
    const customInput = fieldGroup.querySelector('.dose-custom-input');
    
    if (selectElement.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

function addInstructionRow(buttonElement) {
    const instructionBuilder = buttonElement.closest('.instruction-builder');
    const existingRows = instructionBuilder.querySelectorAll('.instruction-row');
    const rowCount = existingRows.length + 1;
    const isTaberTab = instructionBuilder.closest('#taperTabContent') !== null;
    const tabPrefix = isTaberTab ? 'taper' : 'titration';
    
    const newRowHTML = `
        <div class="instruction-row" id="${tabPrefix}InstructionRow${rowCount}">
            <div class="instruction-fields">
                <div class="field-group">
                    <label>Action *</label>
                    <select class="form-select action-select">
                        <option value="">Select Action</option>
                        <option value="take">Take</option>
                        <option value="instill">Instill</option>
                        <option value="inject">Inject</option>
                    </select>
                </div>
                
                <div class="field-group">
                    <label>Dose *</label>
                    <select class="form-select dose-select">
                        <option value="">Select Dose</option>
                        <option value="0.25">0.25</option>
                        <option value="0.5">0.5</option>
                        <option value="1">1</option>
                        <option value="1.5">1.5</option>
                        <option value="2">2</option>
                        <option value="2.5">2.5</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="custom">Custom</option>
                    </select>
                    <input type="number" class="dose-custom-input" placeholder="Enter dose" style="display: none;">
                </div>
                
                <div class="field-group">
                    <label>Unit *</label>
                    <select class="form-select unit-select">
                        <option value="">Select Unit</option>
                        <option value="mg">mg</option>
                        <option value="ml">ml</option>
                        <option value="tablet">tablet</option>
                        <option value="capsule">capsule</option>
                        <option value="drop">drop</option>
                        <option value="unit">unit</option>
                    </select>
                </div>
                
                <div class="field-group">
                    <label>Route *</label>
                    <select class="form-select route-select">
                        <option value="">Select Route</option>
                        <option value="by mouth">By mouth</option>
                        <option value="sublingual">Sublingual</option>
                        <option value="topical">Topical</option>
                        <option value="intravenous">Intravenous</option>
                        <option value="intramuscular">Intramuscular</option>
                        <option value="subcutaneous">Subcutaneous</option>
                        <option value="nasal">Nasal</option>
                        <option value="ophthalmic">Ophthalmic</option>
                    </select>
                </div>
                
                <div class="field-group">
                    <label>Frequency *</label>
                    <select class="form-select frequency-select">
                        <option value="">Select Frequency</option>
                        <option value="once daily">Once daily</option>
                        <option value="twice daily">Twice daily</option>
                        <option value="three times daily">Three times daily</option>
                        <option value="four times daily">Four times daily</option>
                        <option value="every 4 hours">Every 4 hours</option>
                        <option value="every 6 hours">Every 6 hours</option>
                        <option value="every 8 hours">Every 8 hours</option>
                        <option value="every 12 hours">Every 12 hours</option>
                        <option value="as needed">As needed</option>
                    </select>
                </div>
                
                <div class="field-group times-group" style="display: none;">
                    <label>Times</label>
                    <div class="times-container">
                        <input type="time" class="time-input" value="08:00">
                        <input type="time" class="time-input" value="20:00" style="display: none;">
                        <input type="time" class="time-input" value="12:00" style="display: none;">
                        <input type="time" class="time-input" value="18:00" style="display: none;">
                    </div>
                </div>
                
                <div class="field-group">
                    <label>Duration</label>
                    <input type="number" class="form-input duration-input" placeholder="Days" min="1">
                    <span class="duration-label">days</span>
                </div>
                
                <div class="field-group">
                    <label>Then</label>
                    <select class="form-select logic-select">
                        <option value="then">Then</option>
                        <option value="or">Or</option>
                        <option value="and">And</option>
                    </select>
                </div>
                
                <div class="field-actions">
                    <button type="button" class="btn-add-instruction">+</button>
                    <button type="button" class="btn-remove-instruction">×</button>
                </div>
            </div>
        </div>
    `;
    
    instructionBuilder.insertAdjacentHTML('beforeend', newRowHTML);
    
    // Auto-populate route in new instruction row based on main route selection
    const tabContent = instructionBuilder.closest('.tab-content');
    if (tabContent) {
        const mainRouteSelect = tabContent.querySelector('.route-main-select');
        if (mainRouteSelect && mainRouteSelect.value) {
            const newInstructionRow = instructionBuilder.querySelector(`#${tabPrefix}InstructionRow${rowCount}`);
            const newRouteSelect = newInstructionRow.querySelector('.route-select');
            
            if (newRouteSelect) {
                // Map main route values to instruction route values
                const routeMapping = {
                    'oral': 'by mouth',
                    'sublingual': 'sublingual',
                    'topical': 'topical',
                    'intravenous': 'intravenous',
                    'intramuscular': 'intramuscular',
                    'subcutaneous': 'subcutaneous',
                    'nasal': 'nasal',
                    'ophthalmic': 'ophthalmic'
                };
                
                const mappedRoute = routeMapping[mainRouteSelect.value] || mainRouteSelect.value;
                newRouteSelect.value = mappedRoute;
            }
        }
    }
    
    // Update remove buttons visibility
    updateRemoveButtonsVisibility(instructionBuilder);
}

function removeInstructionRow(buttonElement) {
    const instructionRow = buttonElement.closest('.instruction-row');
    const instructionBuilder = instructionRow.closest('.instruction-builder');
    
    instructionRow.remove();
    
    // Update remove buttons visibility
    updateRemoveButtonsVisibility(instructionBuilder);
}

function updateRemoveButtonsVisibility(instructionBuilder) {
    const rows = instructionBuilder.querySelectorAll('.instruction-row');
    const removeButtons = instructionBuilder.querySelectorAll('.btn-remove-instruction');
    
    // Show remove buttons only if there's more than one row
    removeButtons.forEach(btn => {
        btn.style.display = rows.length > 1 ? 'block' : 'none';
    });
}

// Initialize Taper and Titration Medication Search
function initializeTaperTitrationSearch() {
    initializeMedicationSearch('taperMedicationSearch', 'taperMedicationDropdown');
    initializeMedicationSearch('titrationMedicationSearch', 'titrationMedicationDropdown');
}

// Initialize route auto-population functionality
function initializeRouteAutopopulation() {
    // Listen for changes to main route selectors
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('route-main-select')) {
            updateInstructionRoutes(e.target);
        }
    });
}

// Update all instruction routes when main route changes
function updateInstructionRoutes(mainRouteSelect) {
    const tabContent = mainRouteSelect.closest('.tab-content');
    if (!tabContent) return;
    
    const instructionRows = tabContent.querySelectorAll('.instruction-row');
    const newRouteValue = mainRouteSelect.value;
    
    // Map main route values to instruction route values
    const routeMapping = {
        'oral': 'by mouth',
        'sublingual': 'sublingual',
        'topical': 'topical',
        'intravenous': 'intravenous',
        'intramuscular': 'intramuscular',
        'subcutaneous': 'subcutaneous',
        'nasal': 'nasal',
        'ophthalmic': 'ophthalmic'
    };
    
    const mappedRoute = routeMapping[newRouteValue] || newRouteValue;
    
    // Update all instruction route selects
    instructionRows.forEach(row => {
        const routeSelect = row.querySelector('.route-select');
        if (routeSelect) {
            routeSelect.value = mappedRoute;
        }
    });
}

// Initialize Dosing Section Functionality
function initializeDosingSection() {
    console.log('Initializing dosing sections...');
    
    // Set all dosing sections to collapsed by default
    const dosingSections = document.querySelectorAll('.dosing-section-content');
    console.log('Found dosing sections:', dosingSections.length);
    dosingSections.forEach((content, index) => {
        content.style.display = 'none';
        console.log(`Set section ${index} to display: none`);
    });
    
    // Set all collapse buttons to show down arrow
    const collapseButtons = document.querySelectorAll('.dosing-section .collapse-btn');
    console.log('Found collapse buttons:', collapseButtons.length);
    collapseButtons.forEach((btn, index) => {
        btn.textContent = '⌄';
        console.log(`Set button ${index} to down arrow`);
    });
    
    // Remove any existing listeners first
    document.removeEventListener('click', handleDosingClick);
    
    // Add the event listener
    document.addEventListener('click', handleDosingClick);
    console.log('Added dosing section event listener');
}

// Separate function to handle dosing section clicks
function handleDosingClick(e) {
    // Check if click is on dosing section header or collapse button
    const collapseBtn = e.target.closest('.collapse-btn');
    const dosingHeader = e.target.closest('.dosing-section-header');
    
    if (collapseBtn || dosingHeader) {
        console.log('Dosing section clicked!', e.target);
        
        const header = collapseBtn ? collapseBtn.closest('.dosing-section-header') : dosingHeader;
        if (header) {
            e.preventDefault();
            e.stopPropagation();
            
            const section = header.closest('.dosing-section');
            const content = section.querySelector('.dosing-section-content');
            const btn = header.querySelector('.collapse-btn');
            
            console.log('Content display:', content.style.display);
            console.log('Button text:', btn.textContent);
            
            if (content.style.display === 'none' || content.style.display === '') {
                // Expanding
                console.log('Expanding section');
                content.style.display = 'block';
                btn.textContent = '⌃';
            } else {
                // Collapsing
                console.log('Collapsing section');
                content.style.display = 'none';
                btn.textContent = '⌄';
            }
        }
        return;
    }
    
    // Handle add criteria row
    if (e.target.classList.contains('add-criteria-row-btn')) {
        addCriteriaRow(e.target);
    }
    
    // Handle remove criteria row
    if (e.target.classList.contains('remove-criteria-btn')) {
        removeCriteriaRow(e.target);
    }
    
    // Handle add shift dosing row
    if (e.target.classList.contains('add-shift-row-btn')) {
        addShiftRow(e.target);
    }
    
    // Handle remove shift dosing row
    if (e.target.classList.contains('remove-shift-btn')) {
        removeShiftRow(e.target);
    }
    
    // Handle add another criteria based dosing
    if (e.target.classList.contains('add-another-link')) {
        e.preventDefault();
        addAnotherCriteriaBasedDosing(e.target);
    }
}

// Add new criteria row
function addCriteriaRow(buttonElement) {
    const table = buttonElement.closest('.dosing-section-content').querySelector('.criteria-table tbody');
    
    const newRowHTML = `
        <tr class="criteria-row">
            <td>
                <select class="form-select measurement-select">
                    <option value="glucose">Glucose</option>
                    <option value="blood-pressure">Blood Pressure</option>
                    <option value="heart-rate">Heart Rate</option>
                    <option value="temperature">Temperature</option>
                    <option value="pain-score">Pain Score</option>
                </select>
            </td>
            <td>
                <select class="form-select condition-select">
                    <option value="<">&lt;</option>
                    <option value=">">&gt;</option>
                    <option value="=">=</option>
                    <option value="<=">&le;</option>
                    <option value=">=">&ge;</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-input value-input" placeholder="Enter value">
            </td>
            <td>
                <select class="form-select action-select">
                    <option value="do-not-administer">Do not administer</option>
                    <option value="administer">Administer</option>
                    <option value="contact-provider">Contact provider</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-input dose-input" placeholder="Enter dose">
            </td>
            <td>
                <button type="button" class="remove-criteria-btn">×</button>
            </td>
        </tr>
    `;
    
    table.insertAdjacentHTML('beforeend', newRowHTML);
}

// Remove criteria row
function removeCriteriaRow(buttonElement) {
    const row = buttonElement.closest('tr');
    const table = row.closest('tbody');
    
    if (table.children.length > 1) {
        row.remove();
    }
}

// Add new shift dosing row
function addShiftRow(buttonElement) {
    const table = buttonElement.closest('.dosing-section-content').querySelector('.shift-table tbody');
    
    const newRowHTML = `
        <tr class="shift-row">
            <td>
                <select class="form-select assessment-select">
                    <option value="">Select Assessment</option>
                    <option value="glucose">Glucose</option>
                    <option value="blood-pressure">Blood Pressure</option>
                    <option value="heart-rate">Heart Rate</option>
                    <option value="temperature">Temperature</option>
                    <option value="pain-score">Pain Score</option>
                </select>
            </td>
            <td>
                <select class="form-select condition-value-select">
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="=">=</option>
                    <option value="<=">&le;</option>
                    <option value=">=">&ge;</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-input shift-value-input" placeholder="Enter value">
            </td>
            <td>
                <button type="button" class="remove-shift-btn">×</button>
            </td>
        </tr>
    `;
    
    table.insertAdjacentHTML('beforeend', newRowHTML);
}

// Remove shift dosing row
function removeShiftRow(buttonElement) {
    const row = buttonElement.closest('tr');
    const table = row.closest('tbody');
    
    if (table.children.length > 1) {
        row.remove();
    }
}

// Add another criteria based dosing section
function addAnotherCriteriaBasedDosing(linkElement) {
    const currentSection = linkElement.closest('.dosing-section');
    const container = currentSection.parentNode;
    
    const newSectionHTML = `
        <div class="dosing-section">
            <div class="dosing-section-header">
                <h4>ADD CRITERIA BASED DOSING</h4>
                <button type="button" class="collapse-btn">⌄</button>
            </div>
            <div class="dosing-section-content" style="display: none;">
                <div class="criteria-table-container">
                    <table class="criteria-table">
                        <thead>
                            <tr>
                                <th>Measurement/Assessment</th>
                                <th>Condition</th>
                                <th>Value</th>
                                <th>Action</th>
                                <th>Dose</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="criteria-row">
                                <td>
                                    <select class="form-select measurement-select">
                                        <option value="glucose">Glucose</option>
                                        <option value="blood-pressure">Blood Pressure</option>
                                        <option value="heart-rate">Heart Rate</option>
                                        <option value="temperature">Temperature</option>
                                        <option value="pain-score">Pain Score</option>
                                    </select>
                                </td>
                                <td>
                                    <select class="form-select condition-select">
                                        <option value="<">&lt;</option>
                                        <option value=">">&gt;</option>
                                        <option value="=">=</option>
                                        <option value="<=">&le;</option>
                                        <option value=">=">&ge;</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-input value-input" placeholder="Enter value">
                                </td>
                                <td>
                                    <select class="form-select action-select">
                                        <option value="do-not-administer">Do not administer</option>
                                        <option value="administer">Administer</option>
                                        <option value="contact-provider">Contact provider</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-input dose-input" placeholder="Enter dose">
                                </td>
                                <td>
                                    <button type="button" class="remove-criteria-btn">×</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" class="add-criteria-row-btn">+ Add Criteria Row</button>
                <div class="add-another-section">
                    <a href="#" class="add-another-link">📋 Add another Criteria Based Dosing</a>
                </div>
            </div>
        </div>
    `;
    
    // Find the next sibling after the current criteria section
    const nextSibling = currentSection.nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('dosing-section')) {
        container.insertBefore(createElementFromHTML(newSectionHTML), nextSibling);
    } else {
        container.insertBefore(createElementFromHTML(newSectionHTML), currentSection.nextElementSibling);
    }
}

// Helper function to create element from HTML string
function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function initializeMedicationSearch(searchId, dropdownId) {
    const searchInput = document.getElementById(searchId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!searchInput || !dropdown) return;
    
    const options = dropdown.querySelectorAll('.medication-option');
    
    // Show dropdown when input is focused
    searchInput.addEventListener('focus', function() {
        filterMedicationOptions(searchInput, dropdown, options);
        dropdown.style.display = 'block';
    });
    
    // Filter options as user types
    searchInput.addEventListener('input', function() {
        filterMedicationOptions(searchInput, dropdown, options);
    });
    
    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            searchInput.value = this.textContent;
            dropdown.style.display = 'none';
            searchInput.blur();
            
            // Populate strength dropdown and auto-fill route/form
            populateStrengthDropdown(searchId, this.dataset.strength, this.dataset.route, this.dataset.form);
        });
        
        option.addEventListener('mouseenter', function() {
            // Remove selected class from all options
            options.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to hovered option
            this.classList.add('selected');
        });
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const visibleOptions = Array.from(options).filter(opt => opt.style.display !== 'none');
        const selectedOption = dropdown.querySelector('.medication-option.selected');
        let selectedIndex = selectedOption ? visibleOptions.indexOf(selectedOption) : -1;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, visibleOptions.length - 1);
                updateSelectedOption(visibleOptions, selectedIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelectedOption(visibleOptions, selectedIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedOption && selectedOption.style.display !== 'none') {
                    searchInput.value = selectedOption.textContent;
                    dropdown.style.display = 'none';
                    searchInput.blur();
                    
                    // Populate strength dropdown and auto-fill route/form
                    populateStrengthDropdown(searchId, selectedOption.dataset.strength, selectedOption.dataset.route, selectedOption.dataset.form);
                }
                break;
            case 'Escape':
                dropdown.style.display = 'none';
                searchInput.blur();
                break;
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function filterMedicationOptions(searchInput, dropdown, options) {
    const searchTerm = searchInput.value.toLowerCase();
    let hasVisibleOptions = false;
    
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            option.style.display = 'block';
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';
            option.classList.remove('selected');
        }
    });
    
    // Select first visible option if search term exists
    if (hasVisibleOptions && searchTerm.length > 0) {
        const firstVisible = Array.from(options).find(opt => opt.style.display !== 'none');
        if (firstVisible) {
            options.forEach(opt => opt.classList.remove('selected'));
            firstVisible.classList.add('selected');
        }
    }
    
    dropdown.style.display = hasVisibleOptions ? 'block' : 'none';
}

function updateSelectedOption(visibleOptions, selectedIndex) {
    // Remove selected class from all options
    visibleOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to new option
    if (selectedIndex >= 0 && selectedIndex < visibleOptions.length) {
        visibleOptions[selectedIndex].classList.add('selected');
        
        // Scroll selected option into view
        const dropdown = visibleOptions[selectedIndex].closest('.medication-dropdown');
        const optionTop = visibleOptions[selectedIndex].offsetTop;
        const optionBottom = optionTop + visibleOptions[selectedIndex].offsetHeight;
        const dropdownTop = dropdown.scrollTop;
        const dropdownBottom = dropdownTop + dropdown.offsetHeight;
        
        if (optionTop < dropdownTop) {
            dropdown.scrollTop = optionTop;
        } else if (optionBottom > dropdownBottom) {
            dropdown.scrollTop = optionBottom - dropdown.offsetHeight;
        }
    }
}

// Populate strength dropdown and auto-fill route/dosage form based on selected medication
function populateStrengthDropdown(searchId, strengthsString, route, form) {
    let strengthSelectId;
    let routeSelectClass;
    let formSelectClass;
    
    // Determine which selects to populate based on tab
    if (searchId === 'taperMedicationSearch') {
        strengthSelectId = 'taperStrengthSelect';
        routeSelectClass = '.route-main-select';
        formSelectClass = '.dosage-form-select';
    } else if (searchId === 'titrationMedicationSearch') {
        strengthSelectId = 'titrationStrengthSelect';
        routeSelectClass = '.route-main-select';
        formSelectClass = '.dosage-form-select';
    } else {
        return;
    }
    
    const strengthSelect = document.getElementById(strengthSelectId);
    if (!strengthSelect || !strengthsString) return;
    
    // Clear existing options
    strengthSelect.innerHTML = '';
    
    // Parse strengths string and create options
    const strengths = strengthsString.split(', ').map(s => s.trim());
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select strength';
    strengthSelect.appendChild(defaultOption);
    
    // Add strength options
    strengths.forEach(strength => {
        const option = document.createElement('option');
        option.value = strength;
        option.textContent = strength;
        strengthSelect.appendChild(option);
    });
    
    // Enable the dropdown
    strengthSelect.disabled = false;
    
    // Auto-populate route and dosage form
    const tabContent = strengthSelect.closest('.tab-content');
    if (tabContent) {
        const routeSelect = tabContent.querySelector(routeSelectClass);
        const formSelect = tabContent.querySelector(formSelectClass);
        
        if (routeSelect && route) {
            routeSelect.value = route;
        }
        
        if (formSelect && form) {
            formSelect.value = form;
        }
    }
}

// Discontinuation Warning Banner functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dismiss button functionality
    const dismissBtn = document.querySelector('.discontinuation-warning-banner .dismiss-btn');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            const banner = this.closest('.discontinuation-warning-banner');
            banner.style.animation = 'bannerSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        });
    }
    
    // Renew button functionality
    const renewBtn = document.querySelector('.discontinuation-warning-banner .renew-btn');
    if (renewBtn) {
        renewBtn.addEventListener('click', function() {
            // Show a confirmation or open renewal modal
            alert('Order renewal process initiated for Xanax (alprazolam) 0.5 mg. The prescriber will be notified.');
            const banner = this.closest('.discontinuation-warning-banner');
            banner.style.animation = 'bannerSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        });
    }
});

// ========================================
// CONTROLLED SUBSTANCE SETTINGS FUNCTIONALITY
// ========================================

let interactionRuleCounter = 2; // Start at 2 since we have 2 default rules

function addInteractionRule() {
    interactionRuleCounter++;
    const container = document.getElementById('interactionRulesContainer');
    
    const newRule = document.createElement('div');
    newRule.className = 'interaction-rule';
    newRule.setAttribute('data-rule-id', interactionRuleCounter);
    newRule.innerHTML = `
        <div class="rule-statement">
            <span class="rule-text">Do not administer this medication within</span>
            <input type="number" class="rule-hours-input" value="4" min="1" max="72">
            <span class="rule-text">hours of</span>
            <select class="rule-drug-select">
                <option value="">Select medication/class...</option>
                <optgroup label="Drug Classes">
                    <option value="benzodiazepines">All Benzodiazepines</option>
                    <option value="opioids">All Opioids</option>
                    <option value="barbiturates">All Barbiturates</option>
                    <option value="muscle-relaxants">Muscle Relaxants</option>
                    <option value="sedatives">All Sedatives/Hypnotics</option>
                </optgroup>
                <optgroup label="Specific Medications">
                    <option value="alprazolam">Alprazolam (Xanax)</option>
                    <option value="lorazepam">Lorazepam (Ativan)</option>
                    <option value="diazepam">Diazepam (Valium)</option>
                    <option value="clonazepam">Clonazepam (Klonopin)</option>
                    <option value="hydrocodone">Hydrocodone (Vicodin)</option>
                    <option value="oxycodone">Oxycodone (OxyContin)</option>
                    <option value="morphine">Morphine</option>
                    <option value="fentanyl">Fentanyl</option>
                    <option value="tramadol">Tramadol</option>
                </optgroup>
            </select>
            <button type="button" class="rule-remove-btn" onclick="removeInteractionRule(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="rule-risk-indicator">
            <i class="fas fa-lungs"></i>
            <span>Risk: Respiratory Depression</span>
        </div>
    `;
    
    container.appendChild(newRule);
    
    // Animate the new rule
    newRule.style.opacity = '0';
    newRule.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        newRule.style.transition = 'all 0.3s ease';
        newRule.style.opacity = '1';
        newRule.style.transform = 'translateY(0)';
    }, 10);
}

function removeInteractionRule(button) {
    const rule = button.closest('.interaction-rule');
    rule.style.transition = 'all 0.3s ease';
    rule.style.opacity = '0';
    rule.style.transform = 'translateX(20px)';
    setTimeout(() => {
        rule.remove();
    }, 300);
}

// ========================================
// MAR TIMING WARNING MODAL FUNCTIONALITY
// ========================================

function openMarWarningModal() {
    const modal = document.getElementById('marTimingWarningModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeMarWarningModal() {
    const modal = document.getElementById('marTimingWarningModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        // Reset the form
        const reasonSelect = document.getElementById('overrideReason');
        const notesGroup = document.getElementById('overrideNotesGroup');
        const acknowledgment = document.getElementById('overrideAcknowledge');
        const overrideBtn = document.getElementById('overrideAdministerBtn');
        
        if (reasonSelect) reasonSelect.value = '';
        if (notesGroup) notesGroup.style.display = 'none';
        if (acknowledgment) acknowledgment.checked = false;
        if (overrideBtn) overrideBtn.disabled = true;
    }
}

function overrideAndAdminister() {
    const reasonSelect = document.getElementById('overrideReason');
    const reason = reasonSelect ? reasonSelect.options[reasonSelect.selectedIndex].text : 'Unknown';
    
    alert(`Override logged:\n\nReason: ${reason}\n\nMedication administration will proceed. This action has been recorded for audit and compliance review.`);
    closeMarWarningModal();
}

// Initialize MAR warning modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Override reason dropdown change handler
    const overrideReasonSelect = document.getElementById('overrideReason');
    if (overrideReasonSelect) {
        overrideReasonSelect.addEventListener('change', function() {
            const notesGroup = document.getElementById('overrideNotesGroup');
            if (this.value === 'other') {
                notesGroup.style.display = 'block';
            } else {
                notesGroup.style.display = 'none';
            }
            validateOverrideForm();
        });
    }
    
    // Acknowledgment checkbox handler
    const acknowledgeCheckbox = document.getElementById('overrideAcknowledge');
    if (acknowledgeCheckbox) {
        acknowledgeCheckbox.addEventListener('change', validateOverrideForm);
    }
    
    // Notes textarea handler for "other" reason
    const overrideNotes = document.getElementById('overrideNotes');
    if (overrideNotes) {
        overrideNotes.addEventListener('input', validateOverrideForm);
    }
});

function validateOverrideForm() {
    const reasonSelect = document.getElementById('overrideReason');
    const acknowledgeCheckbox = document.getElementById('overrideAcknowledge');
    const overrideNotes = document.getElementById('overrideNotes');
    const overrideBtn = document.getElementById('overrideAdministerBtn');
    
    if (!reasonSelect || !acknowledgeCheckbox || !overrideBtn) return;
    
    const hasReason = reasonSelect.value !== '';
    const isAcknowledged = acknowledgeCheckbox.checked;
    const isOtherReason = reasonSelect.value === 'other';
    const hasNotes = overrideNotes && overrideNotes.value.trim() !== '';
    
    // Enable button if: has reason AND is acknowledged AND (not "other" OR has notes)
    const isValid = hasReason && isAcknowledged && (!isOtherReason || hasNotes);
    overrideBtn.disabled = !isValid;
}
