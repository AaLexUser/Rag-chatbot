// Function to create user message HTML
function createUserMessage(rawText) {
    return `
            <div class="row m-4">
                <div class="d-flex border rounded rounded-3 bg-danger justify-content-center" style="width: 4rem; height: 4rem;">
                    <div class="align-self-center"><h3>U</h3></div>
                </div>
                <div class="col ps-2 align-self-center">
                    ${rawText}
                </div>
            </div>
            <hr>
            `
}

// Function to create bot message HTML
function createBotMessage(response) {
    return `
            <div class="row m-4">
                <div class="d-flex border rounded rounded-3 bg-primary justify-content-center" style="width: 4rem; height: 4rem;">
                    <div class="align-self-center"><h3>A</h3></div>
                </div>
                <div class="col ps-2 align-self-center">
                    ${DOMPurify.sanitize(marked.parse(response))}
                </div>
            </div>
            `;
}

function createBotMessagePlaceHolder(response) {
    return `
            <div class="row m-4" id="tempMsg">
                <div class="d-flex border rounded rounded-3 bg-primary justify-content-center" style="width: 4rem; height: 4rem;">
                    <div class="align-self-center"><h3>A</h3></div>
                </div>
                <div class="col ps-2 align-self-center">
                    <p class="placeholder-glow align-self-center">
                        <span class="placeholder col-8"></span>
                        <span class="placeholder col-11"></span>
                    </p>
                </div>
            </div>
            `;
}

// Function to create source card HTML
function createSourceCard(src) {
    return `<div class="col card border source-card">
                <div class="card-body">
                    <p class="card-title">${src.id}</p>
                    <p class="card-text text-truncate"></p>
                </div>
                <div id="content" popover anchor="auto">
                    <h5 class="card-title">${src.id}</h5>
                    <p class="card-text text-wrap"></p>
                </div>
            </div>
            `;
}

function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      behavior: 'smooth'
    });
}


$(document).ready(function () {
    $(document).on('mouseenter', '.source-card', function() {
        this.children[1].anchor = this.children[1];
        this.children[1].showPopover();
    });

    $(document).on('mouseleave', '.source-card', function() {
        this.children[1].hidePopover();
    });

    $("#messageArea").on("submit", function (event) {
        var rawText = $("#text").val();
        var userHtml = createUserMessage(rawText);
        $("#text").val("");
        $("#msg").append(userHtml);
        const msg = document.getElementById("msg")
        $("#msg").append($.parseHTML(createBotMessagePlaceHolder()))

        $.ajax({
            data: {
                msg: rawText,
            },
            type: "POST",
            url: "/get",
        }).done(function (data) {
            const botHtml = createBotMessage(data.response)
            $("#msg").find("#tempMsg").remove()
            $("#msg").append($.parseHTML(botHtml));
            const sourcesWrapper = $(`<div class="container"><div class="row grid gap-3"></div></div><hr>`)

            data.sources.forEach(src => {
                const sourceTemplate = $(createSourceCard(src));
                $(sourceTemplate).children('.card-body').children('.card-text').text(src.content);
                let html = marked.parse(src.content)
                let sanitized = DOMPurify.sanitize(html);
                $(sourceTemplate).children('#content').children('.card-text').append(sanitized);
                $(sourceTemplate).appendTo(sourcesWrapper.find('.row'));
            });

            $("#msg").append(sourcesWrapper);
            scrollToBottom();
        });
        event.preventDefault();
    });

    $("#fileUpload").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $("#file").val("");
        document.getElementById('uploadBtn').disabled = true
        document.getElementById('uploadBtn').innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
                                                            <span class="visually-hidden">Loading...</span>
                                                        </div>`
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            success: function(data) {
                var notification;
                if (data.new_files != 0) {
                    notification = $(`<div class="bg-success z-3 p-3 border rounded-pill">👉 Adding new documents: ${data.new_files}</div>)`);
                }
                else {
                    notification = $(`<div class="bg-warning z-3 p-3 border rounded-pill text-secondary">✅ No new documents to add</div>)`);
                }
                $('#notification').append(notification);
                notification.fadeIn('slow');
                setTimeout(function() {
                    notification.fadeOut('slow', function() {
                        $(this).remove();
                    });
                }, 5000);
                document.getElementById('uploadBtn').disabled = false
                $('#uploadBtn').text("Upload")
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorNotification = $(`<div class="bg-danger z-3 p-3 border rounded-pill">❌ Error in uploading process: ${textStatus}</div>)`);
                $('#notification').append(errorNotification);
                errorNotification.fadeIn('slow');
                setTimeout(function() {
                    errorNotification.fadeOut('slow', function() {
                        $(this).remove();
                    });
                }, 5000);
                document.getElementById('uploadBtn').disabled = false
                $('#uploadBtn').text("Upload")
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });
});
