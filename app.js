document.addEventListener("DOMContentLoaded", async () => {

  /* =====================================================
     MOUNTPEAK GROUP — SUPABASE + WEBSITE APP
     ===================================================== */

  const SUPABASE_URL =
    "https://yuarhxkntaojgkecwprp.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_WVtRsGn1bzVBRdKi8u3_Tg__ga54oRd";

  let db = null;


  /* =====================================================
     SUPABASE LOADER
     ===================================================== */

  async function loadSupabase(){

    if(window.supabase){

      const { createClient } = window.supabase;

      db = createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );

      return db;
    }

    await new Promise((resolve,reject) => {

      const script = document.createElement("script");

      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);

    });

    const { createClient } = window.supabase;

    db = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    return db;
  }


  try{

    await loadSupabase();

  }catch(error){

    console.error(
      "Supabase failed to load:",
      error
    );

  }


  /* =====================================================
     MOBILE MENU
     ===================================================== */

  const menuButton =
    document.getElementById("menuButton");

  const mainNav =
    document.getElementById("mainNav");

  if(menuButton && mainNav){

    menuButton.addEventListener("click", () => {

      mainNav.classList.toggle("open");

    });

    mainNav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        mainNav.classList.remove("open");

      });

    });

  }


  /* =====================================================
     SMOOTH SCROLL
     ===================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const targetId =
          link.getAttribute("href");

        if(
          !targetId ||
          targetId === "#"
        ){

          return;

        }

        const target =
          document.querySelector(targetId);

        if(target){

          event.preventDefault();

          target.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });

        }

      });

    });


  /* =====================================================
     JOB SEARCH
     ===================================================== */

  const jobSearch =
    document.getElementById("jobSearch");

  const jobType =
    document.getElementById("jobType");

  const jobList =
    document.getElementById("jobList");


  function filterJobs(){

    if(!jobList){
      return;
    }

    const search =
      (jobSearch?.value || "")
        .trim()
        .toLowerCase();

    const type =
      (jobType?.value || "")
        .trim()
        .toLowerCase();


    const jobs =
      jobList.querySelectorAll(
        ".job-card"
      );


    jobs.forEach(job => {

      const text =
        job.textContent.toLowerCase();

      const jobData =
        (
          job.dataset.type ||
          ""
        ).toLowerCase();


      const matchesSearch =
        !search ||
        text.includes(search);

      const matchesType =
        !type ||
        jobData === type ||
        text.includes(type);


      job.style.display =
        matchesSearch && matchesType
          ? ""
          : "none";

    });

  }


  if(jobSearch){

    jobSearch.addEventListener(
      "input",
      filterJobs
    );

  }


  if(jobType){

    jobType.addEventListener(
      "change",
      filterJobs
    );

  }


  /* =====================================================
     JOB APPLICATION SELECTION
     ===================================================== */

  const selectedJob =
    document.getElementById("selectedJob");


  document
    .querySelectorAll("[data-job]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const job =
            button.dataset.job || "";

          if(selectedJob){

            selectedJob.value = job;

          }

        }
      );

    });


  /* =====================================================
     SUPABASE APPLICATION SUBMISSION
     ===================================================== */

  const candidateForm =
    document.getElementById("candidateForm");


  if(candidateForm){

    candidateForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        if(!db){

          alert(
            "Unable to connect to the application system. Please try again."
          );

          return;

        }


        const submitButton =
          candidateForm.querySelector(
            'button[type="submit"], input[type="submit"]'
          );


        const originalText =
          submitButton
            ? submitButton.textContent
            : "";


        if(submitButton){

          submitButton.disabled = true;

          submitButton.textContent =
            "Submitting Profile...";

        }


        try{

          const formData =
            new FormData(candidateForm);


          const fullName =
            (
              formData.get("Full Name") ||
              formData.get("full_name") ||
              formData.get("name") ||
              ""
            ).toString().trim();


          const email =
            (
              formData.get("Email") ||
              formData.get("email") ||
              ""
            ).toString().trim();


          const phone =
            (
              formData.get("Phone") ||
              formData.get("phone") ||
              formData.get("Contact") ||
              formData.get("contact") ||
              ""
            ).toString().trim();


          const appliedJob =
            (
              formData.get("Applied Job") ||
              formData.get("applied_job") ||
              selectedJob?.value ||
              ""
            ).toString().trim();


          const resume =
            formData.get("Resume");


          if(!fullName){

            throw new Error(
              "Please enter your full name."
            );

          }


          if(!email){

            throw new Error(
              "Please enter your email address."
            );

          }


          if(
            !resume ||
            !(resume instanceof File) ||
            !resume.name
          ){

            throw new Error(
              "Please upload your resume."
            );

          }


          /* ---------------------------------------------
             RESUME UPLOAD
             --------------------------------------------- */

          const safeName =
            resume.name
              .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
              );


          const filePath =
            `${Date.now()}-${crypto.randomUUID()}-${safeName}`;


          const {
            error: uploadError
          } =
            await db
              .storage
              .from("Resume")
              .upload(
                filePath,
                resume,
                {
                  cacheControl:"3600",
                  upsert:false
                }
              );


          if(uploadError){

            throw new Error(
              "Resume upload failed: " +
              uploadError.message
            );

          }


          /* ---------------------------------------------
             APPLICATION DATABASE RECORD
             --------------------------------------------- */

          const applicationData = {

            full_name: fullName,

            email: email,

            phone: phone,

            applied_job:
              appliedJob || null,

            resume_path:
              filePath,

            resume_url:
              filePath,

            status:
              "New"

          };


          const {
            error: applicationError
          } =
            await db
              .from("applications")
              .insert(
                applicationData
              );


          if(applicationError){

            /* If database save fails,
               remove uploaded resume */

            await db
              .storage
              .from("Resume")
              .remove([
                filePath
              ]);


            throw new Error(
              "Application could not be saved: " +
              applicationError.message
            );

          }


          /* ---------------------------------------------
             SUCCESS
             --------------------------------------------- */

          candidateForm.reset();


          if(selectedJob){

            selectedJob.value = "";

          }


          alert(
            "Application submitted successfully! MountPeak Group will contact you soon."
          );


          const profileSection =
            document.getElementById("profile");

          if(profileSection){

            profileSection.scrollIntoView({
              behavior:"smooth"
            });

          }


        }catch(error){

          console.error(
            "Application error:",
            error
          );


          alert(
            error.message ||
            "Something went wrong. Please try again."
          );


        }finally{

          if(submitButton){

            submitButton.disabled = false;

            submitButton.textContent =
              originalText ||
              "Submit Profile";

          }

        }

      }
    );

  }


  /* =====================================================
     CONTACT FORM
     ===================================================== */

  document
    .querySelectorAll(
      'form[action*="formsubmit"]'
    )
    .forEach(form => {

      if(form.id === "candidateForm"){
        return;
      }


      form.addEventListener(
        "submit",
        () => {

          const button =
            form.querySelector(
              'button[type="submit"], input[type="submit"]'
            );


          if(button){

            button.disabled = true;

            button.textContent =
              "Sending...";

          }

        }
      );

    });


  /* =====================================================
     AI NAVIGATION
     ===================================================== */

  const aiToggle =
    document.getElementById("aiToggle");

  const aiPanel =
    document.getElementById("aiPanel");


  if(aiToggle && aiPanel){

    aiToggle.addEventListener(
      "click",
      () => {

        aiPanel.classList.toggle("open");

      }
    );

  }


  document
    .querySelectorAll("[data-go]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.go;

          const element =
            document.querySelector(target);

          if(element){

            element.scrollIntoView({
              behavior:"smooth"
            });

          }

          if(aiPanel){

            aiPanel.classList.remove(
              "open"
            );

          }

        }
      );

    });


  /* =====================================================
     AI CHAT
     ===================================================== */

  const chatToggle =
    document.getElementById("chatToggle");

  const chatBox =
    document.getElementById("chatBox");

  const chatClose =
    document.getElementById("chatClose");

  const chatInput =
    document.getElementById("chatInput");

  const chatSend =
    document.getElementById("chatSend");

  const chatMessages =
    document.getElementById("chatMessages");


  if(chatToggle && chatBox){

    chatToggle.addEventListener(
      "click",
      () => {

        chatBox.classList.toggle("open");

      }
    );

  }


  if(chatClose && chatBox){

    chatClose.addEventListener(
      "click",
      () => {

        chatBox.classList.remove(
          "open"
        );

      }
    );

  }


  function addChatMessage(
    message,
    sender = "ai"
  ){

    if(!chatMessages){
      return;
    }


    const div =
      document.createElement("div");


    div.className =
      `chat-message ${sender}`;


    div.textContent =
      message;


    chatMessages.appendChild(div);


    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  }


  function getAIResponse(message){

    const text =
      message.toLowerCase();


    if(
      text.includes("job") ||
      text.includes("jobs") ||
      text.includes("vacancy") ||
      text.includes("opening")
    ){

      return(
        "You can view current MountPeak Group opportunities in the Jobs section. Click Apply on any position to submit your profile."
      );

    }


    if(
      text.includes("apply") ||
      text.includes("resume") ||
      text.includes("profile")
    ){

      return(
        "To apply, select a job and complete the Candidate Profile form. You can upload your PDF, DOC or DOCX resume."
      );

    }


    if(
      text.includes("join") ||
      text.includes("enroll")
    ){

      return(
        "You can join MountPeak Group by completing the Candidate Profile form and submitting your resume."
      );

    }


    if(
      text.includes("service") ||
      text.includes("company")
    ){

      return(
        "MountPeak Group provides technology and professional talent solutions for candidates and employers."
      );

    }


    if(
      text.includes("employer") ||
      text.includes("hire") ||
      text.includes("hiring")
    ){

      return(
        "Employers can connect with MountPeak Group for talent and workforce requirements."
      );

    }


    if(
      text.includes("contact") ||
      text.includes("email")
    ){

      return(
        "You can contact MountPeak Group at hr@mountpeakgroup.com."
      );

    }


    return(
      "I can help you with jobs, applications, resumes, MountPeak Group services and contact information. What would you like to know?"
    );

  }


  function sendChatMessage(){

    if(!chatInput){
      return;
    }


    const message =
      chatInput.value.trim();


    if(!message){
      return;
    }


    addChatMessage(
      message,
      "user"
    );


    chatInput.value = "";


    setTimeout(() => {

      addChatMessage(
        getAIResponse(message),
        "ai"
      );

    },300);

  }


  if(chatSend){

    chatSend.addEventListener(
      "click",
      sendChatMessage
    );

  }


  if(chatInput){

    chatInput.addEventListener(
      "keydown",
      event => {

        if(event.key === "Enter"){

          event.preventDefault();

          sendChatMessage();

        }

      }
    );

  }


  /* =====================================================
     CHAT SUGGESTIONS
     ===================================================== */

  document
    .querySelectorAll(
      "[data-chat]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const message =
            button.dataset.chat ||
            button.textContent;


          if(chatInput){

            chatInput.value =
              message;

            sendChatMessage();

          }

        }
      );

    });


  /* =====================================================
     LOAD LIVE JOBS FROM SUPABASE
     ===================================================== */

  async function loadLiveJobs(){

    if(!db || !jobList){
      return;
    }


    try{

      const {
        data,
        error
      } =
        await db
          .from("jobs")
          .select("*")
          .eq("status","published")
          .order(
            "created_at",
            {
              ascending:false
            }
          );


      if(error){

        console.warn(
          "Live jobs unavailable:",
          error.message
        );

        return;

      }


      if(!data || !data.length){

        return;

      }


      /*
       * Keep existing premium job design.
       * Only replace the job cards when
       * Supabase has published jobs.
       */

      const existing =
        jobList.querySelectorAll(
          ".job-card"
        );


      if(!existing.length){

        jobList.innerHTML =
          data.map(job => {

            return `
              <article
                class="job-card"
                data-type="${escapeAttribute(job.type || "")}"
              >

                <div>

                  <span class="job-tag">
                    ${escapeHtml(job.type || "Opportunity")}
                  </span>

                  <h3>
                    ${escapeHtml(job.title || "Open Position")}
                  </h3>

                  <p>
                    ${escapeHtml(job.location || "Remote")}
                  </p>

                  <p>
                    ${escapeHtml(job.description || "")}
                  </p>

                </div>

                <a
                  href="#profile"
                  class="btn btn-secondary"
                  data-job="${escapeAttribute(job.title || "")}"
                >
                  Apply →
                </a>

              </article>
            `;

          }).join("");


        /* Reconnect Apply buttons */

        jobList
          .querySelectorAll("[data-job]")
          .forEach(button => {

            button.addEventListener(
              "click",
              () => {

                if(selectedJob){

                  selectedJob.value =
                    button.dataset.job || "";

                }

              }
            );

          });

      }

    }catch(error){

      console.warn(
        "Job loading error:",
        error
      );

    }

  }


  /* =====================================================
     HELPERS
     ===================================================== */

  function escapeHtml(value){

    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  function escapeAttribute(value){

    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      );

  }


  /* =====================================================
     START
     ===================================================== */

  await loadLiveJobs();

});
