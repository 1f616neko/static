/**
 * Wang Fuk Court Fire mourning message (monthly)
 * 
 * Suposed to be executed between 25 and 28 of each month for mourning the loss
 * of Wang Fuk Court fire. The fire started at 26 November 2025, and was
 * extinglished on 28. 
 * 
 * This script does not check for whether the date is within the range; instead,
 * it relies on the loading mechanism. Here is a snippet that can be used for
 * this purpose:
 * 
 * <script>
 *  (() => {
 *      const day = (new Date()).getDate();
 *      const testmode = (new URLSearchParams(window.location.search)).has('wfc_message_test');
 *      if ( testmode || (day >= 25 && day <= 28) ) {
 *          const script = document.createElement('script');
 *          script.src = 'https://static.1f616emo.xyz/wfc-message.js';
 *          document.head.appendChild(script);
 *      }
 *  })();
 * </script>
 * 
 * To me in the future: Do NOT use jQuery. jQuery is nice, but we should not 
 * load a whole library just for a single mourning script used a few days.
 */

(async () => {
    // Display configuration
    // TODO: Localization?

    const messages = {
        "wfc-title": "The Wang Fuk Court fire",
        "wfc-body-text": `<p>
            On 26 November 2025, a large fire broke out at the Wang Fuk Court 
            apartment complex in Hong Kong and burned for two days. 168 lives 
            were lost in this tragedy. Improper use of combustible safety nets 
            and expanded polystyrene foam boards accelerated the spread of the 
            fire, and multiple opportunities to prevent the fire have been 
            missed due to governmental oversight. 
        </p>
        <p>
            The calamity, as well as all the losses of lives and suffers, shall 
            not be forgotten.
        </p>`,
        "wfc-learn-more-text": "Learn more...",
        "wfc-learn-more-link": "https://en.wikipedia.org/wiki/Wang_Fuk_Court_fire",
        // "wfc-background-image": "https://upload.wikimedia.org/wikipedia/commons/d/df/Buildings_of_Taipo_apartment_fires.jpg",
        "wfc-background-image": "https://static.1f616emo.xyz/wfc-message-background.jpg",
        "wfc-background-attribution": `
            Background: 
            <a href="https://commons.wikimedia.org/wiki/File:Buildings_of_Taipo_apartment_fires.jpg">am730</a>, 
            <a href="https://creativecommons.org/licenses/by/4.0">CC BY 4.0</a>, via Wikimedia Commons
        `,
        "wfc-exit-label": "Click to close the dialog",
    }

    // Check if we have shown the message to the user in this month
    // If yes, short-circuit and leave
    // Use ?wfc_message_test=1 to forcefully show the message
    try {
        const today = new Date();
        const nowYearMonth = today.getFullYear() * 100 + today.getMonth();
        const lastVisitMonth = localStorage.getItem("wfc_message_last_shown");
        if (lastVisitMonth === null || lastVisitMonth < nowYearMonth) {
            console.log("[wfc-message] Not shown in this month, store and show");
            localStorage.setItem("wfc_message_last_shown", nowYearMonth);
        } else {
            // Check for debug parameter
            const params = new URLSearchParams(window.location.search);
            if (!params.has('wfc_message_test'))
                return;
            console.log("[wfc-message] Debug parameter found");
        }
    } catch (error) {
        // Probably SecurityError, but I'm not gonna dig into it
        // Don't bother the user if we cannot keep track of whether 
        // we have shown the message to the user
        console.warn(
            "[wfc-message] Error while fetching last shown month",
            error
        );
        return;
    }


    // Inject main stylesheet into the page
    // Note that the default font color might have been overriden by the page.
    // Set our own so that light/dark mode doesn't mess us up.
    const e_style = document.createElement('style');
    e_style.textContent = `
        #wfc-overlay-box {
            /* Positioning */
            /* https://www.w3schools.com/howto/howto_js_fullscreen_overlay.asp */
            max-width: 100%;
            max-height: 100%;
            height: 100%;
            width: 100%;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            overflow-x: hidden;

            /* Customization */
            font-family: Arial, sans-serif;
            color: #ffffff;
            background-color: #000000;
        }

        #wfc-overlay-box.fadeout,
        #wfc-overlay-box[open].fadeout::backdrop {
            pointer-events: none;
            animation: wfc-fadeout 0.6s linear forwards;
        }

        #wfc-background-image {
            width: 100%;
            height: 110%;
            position: fixed;
            left: 0;
            top: -10vh;
            overflow: hidden;

            background-image: url('${messages["wfc-background-image"]}');
            background-color: #000000;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: 58% 50%;
            animation: wfc-background-image-slideup 2s cubic-bezier(0,.42,.06,1) forwards;
        }

        #wfc-title {
            position: relative;
            margin-top: 10%;
            margin-left: 10%;
            margin-right: 10%;
            margin-bottom: min(10%, 60px);
            max-width: 720px;
            font-size: 300%;
            font-weight: bold;
            animation: wfc-general-slideup 2s cubic-bezier(0,0,.06,1) forwards;
            animation-delay: 0.2s;
            opacity: 0;
        }

        #wfc-body-text {
            position: relative;
            margin-left: 10%;
            margin-right: 10%;
            max-width: 720px;
            text-shadow: 0.5px 0.5px 0.7px black, 0 0 1em red, 0 0 0.2em red;
            animation: wfc-general-slideup 2s cubic-bezier(0,0,.32,.99) forwards;
            animation-delay: 0.6s;
            opacity: 0;
        }

        #wfc-learn-more {
            position: relative;
            margin-left: 10%;
            margin-right: 10%;
            max-width: 720px;
            text-align: right;
            text-shadow: 0.5px 0.5px 0.7px black, 0 0 1em red, 0 0 0.2em red;
            animation: wfc-general-slideup 1.8s cubic-bezier(0,0,.32,.99) forwards;
            animation-delay: 0.8s;
            opacity: 0;
        }

        #wfc-background-attribution {
            position: absolute;
            bottom: 0;
            left: 0;
            margin: 5%;
            font-color: #ccc;
            font-size: small;
            animation: wfc-fadein 0.3s linear forwards;
            animation-delay: 3s;
            opacity: 0;
        }

        #wfc-exit {
            position: absolute;
            top: 0;
            right: 0;
            animation: wfc-fadein 0.15s linear forwards;
            animation-delay: 3s;
            opacity: 0;
            background: none;
        }

        #wfc-exit svg {
            width: 5vh;
            /* white */
            filter: invert(100%) sepia(95%) saturate(22%) hue-rotate(357deg) brightness(104%) contrast(107%);
        }

        #wfc-overlay-box a {
            color: inherit;
            text-decoration-line: underline;
        }

        @keyframes wfc-background-image-slideup {
            from {
                transform: translateY(10vh);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes wfc-general-slideup {
            from {
                opacity: 0;
                transform: translateY(6vh);
            }
            70% {
                opacity: 1;
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes wfc-fadein {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes wfc-fadeout {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(e_style);

    // Temporary disable the body's overflow
    const old_body_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Create the main box
    const e_overlay_box = document.createElement('dialog');
    e_overlay_box.setAttribute('id', 'wfc-overlay-box');
    e_overlay_box.setAttribute('tabindex', '-1');
    e_overlay_box.setAttribute('aria-label', messages["wfc-title"]);
    document.body.appendChild(e_overlay_box);
    e_overlay_box.showModal();
    e_overlay_box.addEventListener("close", (e) => {
        e_overlay_box.remove();
        e_style.remove();
    });

    // Wait for the image to load
    // https://stackoverflow.com/a/56341485/12805899, <https://creativecommons.org/licenses/by-sa/4.0/>
    await new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = messages["wfc-background-image"];
    });
    const start = Date.now();

    // Insert background image
    const e_background_image = document.createElement('div');
    e_background_image.setAttribute('id', 'wfc-background-image');
    e_overlay_box.appendChild(e_background_image);

    // Title
    const e_title = document.createElement('div');
    e_title.setAttribute('id', 'wfc-title');
    e_title.textContent = messages["wfc-title"];
    e_overlay_box.appendChild(e_title);

    // Body text and Learn More
    const e_body_text = document.createElement('div');
    e_body_text.setAttribute('id', 'wfc-body-text');
    e_body_text.innerHTML = messages["wfc-body-text"];
    e_overlay_box.appendChild(e_body_text);

    // Learn More
    const e_learn_more = document.createElement('div');
    e_learn_more.setAttribute('id', 'wfc-learn-more');
    const e_learn_more_a = document.createElement('a');
    e_learn_more_a.setAttribute('href', messages["wfc-learn-more-link"]);
    e_learn_more_a.setAttribute('target', '_blank');
    e_learn_more_a.textContent = messages["wfc-learn-more-text"];
    e_learn_more.appendChild(e_learn_more_a)
    e_overlay_box.appendChild(e_learn_more);

    // Attribution
    const e_attribution = document.createElement('footer');
    e_attribution.setAttribute('id', 'wfc-background-attribution');
    e_attribution.innerHTML = messages['wfc-background-attribution'];
    e_overlay_box.appendChild(e_attribution);

    // Exit button
    const e_exit = document.createElement('button');
    e_exit.setAttribute('id', 'wfc-exit');
    e_exit.setAttribute('aria-label', messages["wfc-exit-label"]);
    e_exit.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
        >
        <!--
            !Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com 
            License - https://fontawesome.com/license/free 
            Copyright 2026 Fonticons, Inc.
        -->
        <title>${messages["wfc-exit-label"]}</title>
        <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 
        125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 
        137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 
        502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 
        503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 
        137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
        </svg>
    `;
    e_overlay_box.appendChild(e_exit);

    const cancelListener = (e) => {
        e.preventDefault();

        if (Date.now() - start < 3000)
            return;

        e_overlay_box.classList.add('fadeout');
        e_overlay_box.removeEventListener("cancel", cancelListener);

        setTimeout(() => {
            document.body.style.overflow = old_body_overflow;
            e_overlay_box.close();
        }, 600);
    };

    e_overlay_box.addEventListener("cancel", cancelListener);

    e_exit.addEventListener("click", (e) => {
        e.preventDefault();
        if (e_overlay_box.requestClose)
            e_overlay_box.requestClose();
        else
            e_overlay_box.close();
    });
})();