const inputFile = document.getElementById('inputFile');
const userReplacement = document.getElementById('userReplacement');
const assistantReplacement = document.getElementById('assistantReplacement');
const conversationItems = document.getElementById('conversationItems');
const convertButton = document.getElementById('convertButton');

inputFile.addEventListener('change', async (e) => {
    displayConversations();
});

async function convertSelected() {
    const file = inputFile.files[0];
    const chatgptList = JSON.parse(await file.text());
    const selectedIndexes = [...document.querySelectorAll('.conversation-item input:checked')].map(input => parseInt(input.id.split('-')[1]));

    const scrapboxList = [];

    for (const index of selectedIndexes) {
        const chatgptJson = chatgptList[index];
        const mapping = chatgptJson.mapping;
        const root_node_id = Object.entries(mapping).find(([_, data]) => data.parent === null)[0];

        const sorted_nodes = get_ordered_nodes(mapping, root_node_id);

        const lines = [chatgptJson.title];
        let previous_role = null;
        let in_code_block = false;
        const displayUser = userReplacement.value || "user";
        const displayAssistant = assistantReplacement.value || "assistant";

        for (const node of sorted_nodes) {
            const [_, nodeData, role] = node;
            const content = nodeData.message.content.parts[0];
            const displayRole = role === 'user' ? displayUser : displayAssistant;

            if (role !== previous_role) {
                lines.push(displayRole);
                previous_role = role;
            }

            if (typeof content === 'string') {
                for (const line of content.split('\n')) {
                    if (!line.trim()) {
                        continue;
                    }
                    if (line.trim().startsWith("```")) {
                        in_code_block = !in_code_block;
                        if (in_code_block) {
                            if (line.trim().length == 3) {
                                lines.push(" code:script");
                            } else {
                                lines.push(" code:" + line.trim().substr(3));
                            }
                        }
                        continue;
                    }

                    // Markdownの強調表示をScrapboxの強調表示に変換
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "[* $1]");

                    if (in_code_block) {
                        lines.push("  " + formattedLine);
                    } else {
                        lines.push(" " + formattedLine);
                    }
                }
            }
        }

        const scrapbox_json = {
            "title": chatgptJson.title,
            "lines": lines
        };

        scrapboxList.push(scrapbox_json);
    }

    const output = JSON.stringify({ "pages": scrapboxList }, null, 2);
    const outputBlob = new Blob([output], { type: 'application/json' });
    const outputUrl = URL.createObjectURL(outputBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = outputUrl;
    downloadLink.download = 'output.json';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function get_ordered_nodes(mapping, current_node) {
    const node_data = mapping[current_node];
    const children = node_data.children;

    let ordered_nodes = [];

    if (node_data.message !== null && node_data.message.content != null && node_data.message.content.parts != null) {
        const content = node_data.message.content.parts[0];
        const role = node_data.message.author.role;
        if (role !== 'system') {
            ordered_nodes.push([current_node, node_data, role]);
        }
    }

    for (const child of children) {
        ordered_nodes = ordered_nodes.concat(get_ordered_nodes(mapping, child));
    }

    return ordered_nodes;
}

async function displayConversations() {
    const fileInput = document.getElementById('inputFile');
    const file = fileInput.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    const fileContent = await new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsText(file);
    });
    const chatgptList = JSON.parse(fileContent);

    conversationItems.innerHTML = '';

    chatgptList.forEach((chatgptJson, index) => {
        const updateTime = new Date(chatgptJson.update_time * 1000).toLocaleString();
        const itemHtml = `
            <div class="conversation-item" id="item-${index}" style="display: block;">
                <input type="checkbox" id="checkbox-${index}" />
                <label for="checkbox-${index}">${chatgptJson.title} (Updated: ${updateTime})</label>
            </div>
        `;

        conversationItems.insertAdjacentHTML('beforeend', itemHtml);
    });
}

function filterConversations() {
    const filterText = searchInput.value.toLowerCase();
    const conversationItems = document.querySelectorAll('.conversation-item');

    for (const item of conversationItems) {
        const labelText = item.querySelector('label').textContent.toLowerCase();
        if (labelText.includes(filterText)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }
}

function toggleAllCheckboxes() {
    const allCheckboxes = document.querySelectorAll('.conversation-item input[type="checkbox"]');
    const visibleCheckboxes = document.querySelectorAll('.conversation-item[style*="display: block;"] input[type="checkbox"]');
    const allChecked = Array.from(allCheckboxes).every(checkbox => checkbox.checked);
    let targetList = allChecked ? allCheckboxes : visibleCheckboxes;

    for (const checkbox of targetList) {
        checkbox.checked = !allChecked;
    }
}
