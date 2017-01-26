var actualCode = '(' + function () {

        /**
         * RUN AJAX LISTENER
         */
        jQuery(document).ajaxComplete(function (event, xhr, settings) {
            var response = jQuery.parseJSON(xhr.responseText)

            //check if captured AJAX request is a get tickets request
            if (response.tickets && response.tickets.length) {
                renderStatuses(response.tickets)
            }

        });

        /*******************************/
        /********** FUNCTIONS **********/
        /*******************************/

        /**
         * Attach statues to tickets
         *
         * @param array tickets - Tickets array from AJAX response
         */
        function renderStatuses(tickets) {
            jQuery.each(tickets, function (index, card) {
                var $cardSelector = getCard(card.number);
                var status = getStatus(card)
                var html = generateStatusHTML(status);

                addHtml($cardSelector, html);
            })
        }

        /**
         * Get card element by ID of the card
         *
         * @param id - card ID
         * @returns {*}
         */
        function getCard(id) {
            return jQuery('*[data-ticket-number="' + id + '"]');
        }

        /**
         * Gets status text
         *
         * @param card
         */
        function getStatus(card) {

            return card.custom_fields[1083203] != undefined
                ? card.custom_fields[1083203]
                : '';
        }

        /**
         * Generates HTML code with status.
         * This code can be appended in ticket
         *
         * @param status
         * @returns {string}
         */
        function generateStatusHTML(status) {

            var statusModifier = getStatusClassModifier(status)

            var html =
                '<div class="ass-status ' + statusModifier + '">' +
                status +
                '</div>'

            return html;
        }

        /**
         * Analyses status text and returns CSS modifier class
         *
         * @returns {string}
         */
        function getStatusClassModifier(status) {
            var assStatuses = {
                DEFAULT: 'ass-status__default',
                FAILED: 'ass-status__failed',
                READY: 'ass-status__ready',
                REVIEW: 'ass-status__review',
            }

            var statusModifier = assStatuses.DEFAULT;

            switch (status) {
                case 'Code Review':
                    statusModifier = assStatuses.REVIEW
                    break;
                case 'Ready for Upload on Dev':
                    statusModifier = assStatuses.READY
                    break;
                case 'Testing on Dev Failed':
                case 'Testing on Staging Failed':
                case 'Testing on LIVE Failed':
                case 'Code Review Failed':
                    statusModifier = assStatuses.FAILED
                    break;
            }

            return statusModifier;
        }

        /**
         * Renders status on a card element
         *
         * @param $card Card selector
         * @param html
         */
        function addHtml($card, html) {
            return $card.find('.u-cardwallCardMeta').before(html)
        }

    } + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
