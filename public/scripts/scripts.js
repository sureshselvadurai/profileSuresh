$(document).ready(function () {
    // Highlight active link in the navbar
    var currentPath = window.location.pathname;
    $('.navbar-center a').each(function () {
        var $link = $(this);
        $link.removeClass('active-link');
        if ($link.attr('href') === currentPath) {
            $link.addClass('active-link');
        }
    });

    // Handle like button interactions
    const $likeButton = $('#likeButton');
    const $emojiBox = $('#emojiBox');
    const $likeText = $('#likeText');

    $likeButton.hover(function () {
        $emojiBox.show();
    }, function () {
        $emojiBox.hide();
    });

    $emojiBox.find('button').click(function () {
        const emoji = $(this).data('emoji');
        $likeButton.removeClass('like-highlight love-highlight celebrate-highlight insight-highlight');
        $likeText.text(emoji);
        $likeButton.addClass(`${emoji.toLowerCase()}-highlight`);
        $emojiBox.hide();
    });

    // Sidebar useful links animations
    const $sidebarLinks = $('.sidebar-useful-links a');
    $sidebarLinks.fadeIn(1500).slideDown(1000);
    $sidebarLinks.hover(function () {
        $(this).animate({ color: 'red', fontSize: '16px' }, 100);
    }, function () {
        $(this).animate({ color: 'black', fontSize: '14px' }, 100);
    });

    // Set the last sidebar link to the current date and time
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDateTime = currentDate.toLocaleString('en-US', options);
    $(".sidebar-useful-links a:last").text(formattedDateTime);

    // Load PDF content into iframe
    $.get('/getpdf', function (data) {
        $('#pdfFrame').attr('src', `data:application/pdf;base64,${data.pdfText}`);
    });

    // Duplicate and modify the chat box
    if ($('#contact-main').length > 0) {
        var chatBox = $('#chat-box');
        var chatBoxReplica = chatBox.clone().attr('id', 'contact-chat-box');
        chatBoxReplica.css('animation', 'none');
        chatBoxReplica.appendTo('#contact-main');
        chatBox.remove();
    }

    // Handle post button click
    $('#postButton').on('click', function () {
        const description = $('#postTextarea').val();
        const newPost = $('<div>').addClass('post');
        newPost.load('/constants/post.js', function () {
            newPost.find('.post-author h1').text('Suresh Raja');
            newPost.find('.post-author small:first-child').text('CS Grad Student @University of San Francisco | FullStack Developer | Ex - AI Consultant');
            newPost.find('.post p').text(description);
        });
        $('#postsContainer').prepend(newPost);
        $('#postTextarea').val('');
    });

    // Handle user conversation
    function appendMessage(container, sender, message) {
        var messageDiv = $('<div></div>').addClass(sender).text(message);
        container.append(messageDiv);
    }

    $('#buttonSend').click(function () {
        var userInput = $('#user-input').val();
        var conversationDiv = $('#conversation');

        if ($.trim(userInput) !== '') {
            appendMessage(conversationDiv, 'user', userInput);

            setTimeout(function () {
                appendMessage(conversationDiv, 'server', "Currently away. We have received your message and will inform you.");
            }, 500);
        }

        const message = $('#user-input').val();

        $.ajax({
            type: 'POST',
            url: '/addQuery',
            data: { message: message },
            success: function (response) {
                console.log('Message sent successfully:', response);
            },
            error: function (error) {
                console.error('Error sending message:', error);
            }
        });

        $('#user-input').val('');
    });
});
