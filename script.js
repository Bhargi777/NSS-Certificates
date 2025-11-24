 // FIREBASE CONFIGURATION
       const firebaseConfig = {
            apiKey: "AIzaSyCZZdmmCCZtq0YkMJ2rihL0l-jd6ulWvyc",
            authDomain: "certificates-nss-67fa9.firebaseapp.com",
            projectId: "certificates-nss-67fa9",
            storageBucket: "certificates-nss-67fa9.firebasestorage.app",
            messagingSenderId: "757768571172",
            appId: "1:757768571172:web:462a42300da205e3810bb1"
        };
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);

        // DOM ELEMENTS
        const form = document.getElementById('certificateForm');
        const rollNumberInput = document.getElementById('rollNumber');
        const studentNameInput = document.getElementById('studentName');
        const submitBtn = document.getElementById('submitBtn');
        const loading = document.getElementById('loading');
        const message = document.getElementById('message');

        // MESSAGE HELPERS
        function showMessage(text, type, htmlMode=false) {
            message.className = `message ${type} show`;
            message.style.display = 'block';
            if (htmlMode) {
                message.innerHTML = text;
            } else {
                message.textContent = text;
            }
        }

        function hideMessage() {
            message.className = 'message';
            message.style.display = 'none';
        }
        function showLoading() {
            loading.classList.add('show');
            submitBtn.disabled = true;
        }
        function hideLoading() {
            loading.classList.remove('show');
            submitBtn.disabled = false;
        }

        // CERTIFICATE RETRIEVAL
        async function getCertificate(rollNumber) {
            try {
                const fileName = `${rollNumber}.pdf`;
                const certificateRef = ref(storage, `certificates/${fileName}`);
                const downloadUrl = await getDownloadURL(certificateRef);
                return downloadUrl;
            } catch (error) {
                if (error.code === 'storage/object-not-found') {
                    throw new Error('Certificate not found. Please verify your roll number.');
                } else if (error.code === 'storage/unauthorized') {
                    throw new Error('Access denied. Please contact the administrator.');
                } else {
                    throw new Error('Failed to retrieve certificate.');
                }
            }
        }

        // FORM SUBMISSION
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessage();
            showLoading();
            const rollNumber = rollNumberInput.value.trim().toUpperCase();
            const studentName = studentNameInput.value.trim();

            if (studentName.length < 2) {
                showMessage('Please enter a valid name', 'error');
                hideLoading();
                return;
            }
            try {
                // Fetch certificate
                const certificateUrl = await getCertificate(rollNumber);
                showMessage(
                    `Certificate found for ${rollNumber}!<br>
                    <a href="${certificateUrl}" class="btn" style="margin-top:10px;display:inline-block;" download>
                        Download Certificate PDF
                    </a>`, 
                    'success', 
                    true       // this enables innerHTML rendering!
                );

            } catch (error) {
                showMessage(error.message, 'error');
            } finally {
                hideLoading();
            }
        });

        rollNumberInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
