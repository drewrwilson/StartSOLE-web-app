const Resource = module.exports = {};
const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

// returns an array of all resources
Resource.getAll = function () {
  // return Parse.Cloud.run('webapp.getResources')
  // var Resource = {tags : {
  //   question-help": 'Help with Question phase',
  //   investigation-help": 'Help with Investigation phase',
  //   review-help": 'Help with Review phase',
  //   paraphrasing: 'Paraphrasing support',
  //   posters: 'Posters',
  //   rubric: 'Rubrics',
  //   self-assessment": 'Self-assessments',
  //   sentenceStarters: 'Sentence starters',
  //   organizer: 'Student organizers'
  // }};
    const resources = [
        {
            file: 'SOLE_Website_Resources.docx',
            image: 'sole_resources_matte_black.jpg',
            title: 'Helpful Websites',
            short: "A list of kid-friendly websites organized by subject.",
            description: "A list of kid-friendly websites organized by subject.  Great tool for students to start their SOLE investigations.",
            authors: [
                {email: 'jeff.mcclellan.9@gmail.com', name: 'Jeff M.'}
            ],
            tags: [
                "investigation-help"
            ]
        },
        {
            file: 'SOLEIntroductoryBooks.pdf',
            image: 'introductory_books_matte_black.png',
            title: 'Introductory Books',
            short: "A list of books/videos to promote questioning.",
            description: "A book and video list that teachers can use to promote questioning and wonderings to introduce SOLE.",
            authors: [
                {email: 'dietz_j@shaker.org', name: 'Jocelyn D.'}
            ],
            tags: [
                "question-help"
            ]
        },
        {
            file: 'Text_to_speech_apps_for_iPad.docx',
            image: 'texttospeech_matte_black.png',
            title: 'Text to Speech Apps',
            short: "Apps for students who struggle with reading.",
            description: "If your students have trouble with reading, try using these helpful apps to read sites to them while they research.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help"
            ]
        },
        {
            file: 'SOLEGuide.pdf',
            image: 'sole_guide_matte_black.jpg',
            title: 'Student Organizer',
            short: "A self-organizer for students doing SOLE.",
            description: "A self-organizer for students to track their SOLE research and organize their presentation. Includes guiding questions for formative self-reflection, and an evaluation rubric.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "self-assessment", "organizer", "rubric"
            ]
        },
        {
            file: 'SOLE research notes.docx',
            image: 'SOLE_Research_Notes_matte_black.png',
            title: 'Research Notes',
            short: "An organizer to help with paraphrasing.",
            description: "A clear organizer to help students practice paraphrasing content they find in their SOLE investigations.",
            authors: [
                {email: 'clark_k@shaker.org', name: 'Ms. Clark'}
            ],
            tags: [
                "investigation-help", "paraphrasing"
            ]
        },
        {
            file: 'Social_Skills_Assessment.docx',
            image: 'socialskills_matte_black.jpg',
            title: 'Social Skills',
            short: "Self-assessment of cooperation, leadership, responsibility, and respect.",
            description: "Self-assessment sheet for students to reflect on their social skills - with an emphasis on cooperation, leadership, responsibility, and respect.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "self-assessment"
            ]
        },
        {
            file: 'Self-management_Skills_Assessment.docx',
            image: 'selfmanagementskills_matte_black.jpg',
            title: 'Self-Management',
            short: "Self-assessment of time-management, choices, organization, and safety.",
            description: "Self-assessment of student's behavior management skills. Includes sections for time management, making choices, organization, and safety.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "self-assessment"
            ]
        },
        {
            file: 'Research_Skills_Assessment.docx',
            image: 'researchskills_matte_black.jpg',
            title: 'Research Skills',
            short: "Self-assessment of research and presentation skills.",
            description: "Student self-assessment tool for research skills. Includes sections for observing, planning, and presenting along with collecting, recording, and interpreting data.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "self-assessment"
            ]
        },
        {
            file: 'SOLESentenceStarters-Presentations.pdf',
            image: 'sentence_starters_matte_black.png',
            title: 'Sentence Starters',
            short: "Sentence stems for student presentations.",
            description: "Sentence stems that students can use when presenting their SOLE information.",
            authors: [
                {email: 'dietz_j@shaker.org', name: 'Jocelyn D.'}
            ],
            tags: [
                "review-help", "sentence-starters"
            ]
        },
        {
            file: 'SOLE_Recording_Form.docx',
            image: 'recording_form_matte_black.png',
            title: 'Recording Form',
            short: "A structured form to guide SOLE investigations.",
            description: "A structured form to guide SOLE investigations. Appropriate for elementary and early middle school students.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "organizer"
            ]
        },
        {
            file: 'SOLE_Recording_Form.docx',
            image: 'recording_form_2_matte_black.png',
            title: 'Recording (KWL)',
            short: "A KWL schema for SOLE investigations",
            description: "A structured form to guide SOLE investigations aligned to KWL schema. Appropriate for elementary and early middle school students.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "organizer"
            ]
        },
        {
            file: 'SOLE_Recording_Form_basic.docx',
            image: 'recording_form_basic_matte_black.png',
            title: 'Recording (Simple)',
            short: "A SOLE investigation guide with room for drawing as well as writing.",
            description: "A SOLE investigation guide with room for drawing as well as writing. Appropriate for students who are learning to write or are more comfortable drawing.",
            authors: [
                {email: 'dorabechtel@gmail.com', name: 'Dora B.'}
            ],
            tags: [
                "investigation-help", "organizer"
            ]
        },
        {
            file: 'soleorganizer.pdf',
            image: 'soleorganizer_matte_black.png',
            title: 'Recording (Hypothesis)',
            short: "A modified recording form with room for a hypothesis.",
            description: "A modified version of the recording form where students can include a hypothesis before they begin their SOLE investigation. Great for science classes!",
            authors: [
                {email: 'bishko_j@shaker.org', name: 'Jeremy B.'}
            ],
            tags: [
                "investigation-help", "organizer"
            ]
        },
        {
            file: 'CommunicationSkills.pdf',
            image: 'communication_skills_matte_black.png',
            title: 'Communication Poster',
            short: "A poster outlining presentation skills for SOLE.",
            description: "A reminder for students how to behave during presentations with specific tips for effective speaking and engaged listening.  Designed for kindergarten and up!",
            authors: [
                {email: 'Heather.Snyder@clevelandmetroschools.org', name: 'Heather S.'}
            ],
            tags: [
                "review-help"
            ]
        },
        {
            file: 'GlowAndGrowWithSOLE.pdf',
            image: 'glow_and_grow_matte_black.png',
            title: 'Glow & Grow',
            short: "A strategy for giving feedback to students during SOLE presentations.",
            description: "A description of the Glow & Grow technique for giving feedback on student presentations with a graphic organizer for students.",
            authors: [
                {email: 'erika.howard@clevelandmetroschools.org', name: 'Erika H.'}
            ],
            tags: [
                "review-help"
            ]
        },
        {
            file: 'SOLEChecklist.docx',
            image: 'sole_checklist_matte_black.png',
            title: 'SOLE Checklist',
            short: "A self-assessment reminder checklist for students.",
            description: "A reminder checklist for students to self-assess their progress as they research and prepare to present.",
            authors: [
                {email: 'jonathan.bubbett@clevelandmetroschools.org', name: 'Miles B.'}
            ],
            tags: [
                "investigation-help", "organizer", "self-assessment"
            ]
        },
        {
            file: 'SOLEROLETemplate.docx',
            image: 'sole_role_template_matte_black.png',
            title: 'Roles Template',
            short: "An organizer to list roles and scaffold taking turns.",
            description: "A simple template for groups to list their roles and prepare to switch between roles to scaffold taking turns.",
            authors: [
                {email: 'jonathan.bubbett@clevelandmetroschools.org', name: 'Miles B.'}
            ],
            tags: [
                "investigation-help", "review-help", "organizer"
            ]
        },
        {
            file: 'OnlineResourcesNotes.docx',
            image: 'online_resources_notes_matte_black.png',
            title: 'Resources Notes',
            short: "A review of key concepts and terms for online research.",
            description: "A practice sheet with fill in the blanks for students to review key terms and concepts for assessing online resources.",
            authors: [
                {email: 'jonathan.bubbett@clevelandmetroschools.org', name: 'Miles B.'}
            ],
            tags: [
                "investigation-help"
            ]
        },
        {
            file: 'SOLE_Presentations_Review.docx',
            image: 'sole_presentation_matte_black.png',
            title: 'Presentations Review',
            short: "A tool to support constructive feedback from peers",
            description: "A way to help students stay engaged and focused on presentations and give each other constructive feedback.",
            authors: [
                {email: 'lindzyt@gmail.com', name: 'Lindsay A.'}
            ],
            tags: [
                "review-help", "organizer"
            ]
        },
        {
            file: 'SOLE_Reflection.docx',
            image: 'sole_reflection_matte_black.png',
            title: 'Reflection',
            short: "An individual self-reflection to be completed after a SOLE.",
            description: "A self reflection for each student to do individually after SOLE is complete.  Holds students accountable for their thinking and learning outside of the group and helps them reflect on ways they can improve their learning.",
            authors: [
                {email: 'lindzyt@gmail.com', name: 'Lindsay A.'}
            ],
            tags: [
                "self-assessment"
            ]
        },
        {
            file: 'PBLLiteSOLECreationSheets.pdf',
            image: 'SOLEPBLLite_matte_black.png',
            title: 'SOLE Creation Sheets',
            short: "A modified PBL guide for setting up SOLEs.",
            description: "A quick guide for setting up SOLEs, using a modified Project Based Learning format to generate big questions and goals for students.",
            authors: [
                {email: 'DAVID_J@hcde.org', name: 'David J.'}
            ],
            tags: [
                "question-help"
            ]
        },
        {
            file: 'Keywords_for_Research.pdf',
            image: 'keywords_matte_black.png',
            title: 'Keywords',
            short: "A guide to establishing keywords with students.",
            description: "Establishing key words before students begin their research can help focus their investigation.  This guide can help you facilitate the process with your class.",
            authors: [
                {email: 'larmstrong@mcspresidents.org', name: 'Lindsay T.'}
            ],
            tags: [
                "investigation-help"
            ]
        },
        {
            file: 'SOLEGoogleClassroom.pdf',
            image: 'google_classroom_matte_black.png',
            title: 'Google Classroom',
            short: "A strategy for integrating SOLE with Google classroom.",
            description: "If you use Google classroom, you might be interested in this strategy during a SOLE session to help students practice collaborating with technology.",
            authors: [
                {email: 'macsurak@sel.k12.oh.us', name: 'Erin M.'}
            ],
            tags: [
                "investigation-help"
            ]
        },
        {
            file: 'SOLE_Student_Worksheet.docx',
            image: 'sole_worksheet_matte_black.jpg',
            title: 'SOLE Worksheet',
            short: "A complete worksheet with organizers, self-assessment, and rubrics.",
            description: "A one stop shop worksheet for SOLE.  Includes room for notes during investigation," +
                " suggested presentation types, self and peer evaluations, and rubrics.",
            authors: [
                {email: 'darnold@npesc.org', name: 'Dwayne A.'}
            ],
            tags: [
                "self-assessment", "organizer", "question-help", "investigation-help", "review-help", "rubric"
            ]
        },
        {
            file: 'SOLE_Roles.pdf',
            image: 'sole_roles_matte_black.png',
            title: 'SOLE Roles',
            short: "A simple graphic organizer for younger students to help them organize groups.",
            description: "A colorful graphic reminding younger students of key roles.  Leaders, researchers," +
                " writers, and presenters are all described in a colorful poster ready to hang up on your wall.",
            authors: [
                {email: 'bgoodwin@monroevilleschools.org', name: 'Brandi G.'}
            ],
            tags: [
                "organizer", "investigation-help", "review-help"
            ]
        },
        {
            file: 'SOLE_Post-Assessment.pdf',
            image: 'sole_post_assessment_matte_black.png',
            title: 'SOLE Post-Assessment',
            short: "An exit ticket printout for students to individually reflect on the SOLE question.",
            description: "A simple exit ticket printout for students to individually reflect on the SOLE" +
                " question and rate their work for the day.",
            authors: [
                {email: 'bgoodwin@monroevilleschools.org', name: 'Brandi G.'}
            ],
            tags: [
                "self-assessment", "organizer"
            ]
        },
        {
            file: 'Sample_Rubric_for_Public_Speaking_5th_Grade.docx',
            image: '5th_grade_rubric.png',
            title: 'Sample Presentation Rubric',
            short: "A rubric aligning public speaking skills used in SOLE to standards.",
            description: "A sample rubric which aligns public speaking skills to common core ELA standards." +
                "  This rubric is designed for 5th grade but can easily be modified to use with speaking & listening" +
                " standards from other grade levels",
            authors: [
                {email: 'jeff.mcclellan.9@gmail.com', name: 'Jeff M.'}
            ],
            tags: [
                "review-help", "organizer", "rubric"
            ]
        },
        {
            file: 'SOLE_Interested_Listener_Feedback.pdf',
            image: 'SOLE_Interested_Listener_Feedback_matte_black.png',
            title: 'Interested Listener Feedback',
            short: "An organizer for students to provide feedback to their peers.",
            description: "A useful organizer for students to summarize their own answer to the SOLE question" +
                " and provide feedback for their peers using the glow/grow structure.  Includes helpful sentence " +
                "starter prompts for giving constructive feedback.",
            authors: [
                {email: 'dmoody@perkinsschools.org', name: 'Danielle M.'}
            ],
            tags: [
                "review-help", "organizer", "sentence-starters", "self-assessment"
            ]
        },
        {
            file: 'SOLE_DoK_Posters.pdf',
            image: 'SOLE_DoK_Posters.png',
            title: 'Depth of Knowledge Posters',
            short: "Four posters to summarize the application of Webb's Depth of Knowledge in SOLE",
            description: "A series of helpful posters to remind students (and teachers!) how Webb's Depth of" +
                " Knowledge is structured and how each level can be related to the SOLE process.  Includes examples" +
                " and key words for identifying and categorizing the type of thinking involved in tasks.",
            authors: [
                {email: 'bgoodwin@monroevilleschools.org', name: 'Brandi G.'}
            ],
            tags: [
                "investigation-help", "review-help", "posters"
            ]
        },
        {
            file: 'Research_Roundup.pdf',
            image: 'research_roundup_matte_black.png',
            title: 'Research Roundup',
            short: "A graphic organizer to aid in collecting and synthesizing evidence",
            description: "This tool was designed for 10th graders to help them organize their research and" +
                " synthesize what they find.  Includes sections for recording sources to help students practice" +
                " citing their work, and also suggests that students find a counter-argument to encourage" +
                " researching alternate viewpoints.",
            authors: [
                {email: 'Adam.Trifiro@clevelandmetroschools.org', name: 'Adam T.'}
            ],
            tags: [
                "investigation-help", "organizer", "paraphrasing"
            ]
        },
        {
            file: 'SOLE_and_Gifted_Education.docx',
            image: 'SOLE_and_Gifted_Education_matte_black.png',
            title: 'SOLE & Gifted Education',
            short: "A resource for employing the SOLE process to encourage gifted students.",
            description: "The following outline has been created as a resource for Classroom Teachers and Gifted Intervention Specialists who employ the SOLE process and philosophy to encourage gifted student driven lessons that address.",
            authors: [
                {email: 'bgift@esclakeeriewest.org', name: 'Brenda G.'},
                {email: 'darnold@npesc.org', name: 'Dwayne A.'}
            ],
            tags: [
                "investigation-help", "question-help", "review-help"
            ]
        },
        {
            file: 'STARTSOLE_101_ESCLEW.pptx',
            image: 'STARTSOLE_101_ESCLEW.png',
            title: 'StartSOLE 101 for ESCLEW',
            short: "An introduction to StartSOLE for the ESC of Lake Erie West in Ohio",
            description: "This presentation was created for a training about StartSOLE for Lake Erie West ESC in Ohio",
            authors: [
                {email: 'bgift@esclakeeriewest.org', name: 'Brenda G.'},
                {email: 'asmith@npesc.org', name: 'Andrea S.'}
            ],
            tags: [
                "training"
            ]
        },
        {
            file: 'SOLEInquiryMatrix.pdf',
            image: 'SOLE_inquiry_matrix_matte_black.png',
            title: 'SOLE Inquiry Matrix',
            short: "A helpful matrix for scaffolding inquiry during the phases of a SOLE",
            description: "This useful organizer offers tips and tricks for different levels of inquiry during each phase of a SOLE.  Great for teachers who are just getting started with the process!",
            authors: [
                { email: 'eric.daigle@hsc.on.ca', name: 'Eric D.'}
            ],
            tags: [
                "training", "question-help", "investigation-help", "review-help", "posters", "rubric"
            ]
        },
        {
            file: 'StartSOLE-heart-and-sole.pdf',
            image: 'StartSOLE-heart-and-sole.jpg',
            title: 'Heart and SOLE',
            short: "A one page infographic about SOLE ",
            description: "This full color infographic explains the three main steps in the SOLE methology. This is great for introducing new teachers or administrators to SOLE.",
            authors: [
                { email: 'jeff@startsole.org', name: 'Jeff McClellen'}
            ],
            tags: [
                "training", "question-help", "investigation-help", "review-help", "posters"
            ]
        }
    ];
    return Parse.Promise.as(resources);
};
