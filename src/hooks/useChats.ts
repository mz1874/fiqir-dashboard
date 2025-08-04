import {ref} from 'vue';
import axios from 'axios';
import type {ChatMessage} from '@/interface/ChatMessage';
import {message as antdMessage} from 'ant-design-vue';

export function useChat() {
    const input = ref('');
    const loading = ref(false);
    const messages = ref<ChatMessage[]>([]);
    const ollamaUrl = ref('http://localhost:11434');
    const models = ref<string[]>([]);
    const selectedModel = ref('');
    const uploadedFiles = ref<string[]>([]);

    // 上传文件
    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            loading.value = true;

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;
            if (result && result.filename) {
                uploadedFiles.value.push(result.filename);
            }
        } catch (error) {
            console.error('上传失败', error);
        } finally {
            loading.value = false;
        }
    };

// 删除标签
    const removeFile = (name: string) => {
        uploadedFiles.value = uploadedFiles.value.filter(f => f !== name);
    };

    const fetchModels = async () => {
        try {
            const response = await axios.get(`${ollamaUrl.value}/api/tags`);
            models.value = response.data.models.map((m: any) => m.name);
            if (!selectedModel.value && models.value.length > 0) {
                selectedModel.value = models.value[0];
            }
        } catch (err) {
            antdMessage.error('无法获取模型列表');
            console.error(err);
        }
    };

    const sendMessage = async () => {
        const userMessage = input.value.trim();
        if (!userMessage || !selectedModel.value) return;

        messages.value.push({role: 'user', content: userMessage});
        input.value = '';
        loading.value = true;

        const assistantMessage: ChatMessage = {role: 'assistant', content: ''};
        messages.value.push(assistantMessage);

        try {
            const response = await fetch(`${ollamaUrl.value}/api/chat`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    model: selectedModel.value,
                    messages: messages.value.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            if (!reader) {
                antdMessage.error('响应流读取失败');
                return;
            }

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {stream: true});

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        const chunk = json.message?.content;
                        if (chunk) {
                            assistantMessage.content += chunk;
                            messages.value = [...messages.value]; // trigger reactivity
                        }
                    } catch (e) {
                        console.error('JSON parse error:', line, e);
                    }
                }
            }
        } catch (err) {
            antdMessage.error('请求失败');
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const handleSend = async () => {
        if (!input.value.trim() && uploadedFiles.value.length === 0) return;

        const fileNote = uploadedFiles.value.map(name => `[图片](${name})`).join('\n');
        input.value += (fileNote ? `\n${fileNote}` : '');
        await sendMessage();

        uploadedFiles.value = []; // 清空标签
    };

    function handleDrop(event: DragEvent) {
        event.preventDefault();

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return;

        for (const file of Array.from(files)) {
            uploadImage(file);
        }
    }


    const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    uploadImage(file);
                }
            }
        }
    };


    return {
        uploadedFiles,
        input,
        loading,
        messages,
        ollamaUrl,
        models,
        selectedModel,
        fetchModels,
        sendMessage,
        uploadImage,
        removeFile,
        handleSend,
        handleDrop,
        handlePaste,
    };
}
