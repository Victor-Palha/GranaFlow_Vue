<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useAPI } from '@/composables/useApi';
import type { AxiosError } from 'axios';
import { 
  CloudArrowUpIcon,
  XMarkIcon,
  ArrowPathIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  handleGetProofUrl(url: string): void
}>()

interface SuccessResponse {
  message: string;
  url: string;
}

interface FileWithSize extends File {
  size: number;
}

const file: Ref<FileWithSize | null> = ref(null);
const isUploading: Ref<boolean> = ref(false);
const isDragging: Ref<boolean> = ref(false);
const errorMessage: Ref<string> = ref('');
const successData: Ref<SuccessResponse | null> = ref(null);
const fileInput: Ref<HTMLInputElement | null> = ref(null);

function triggerFileInput(): void {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleDragOver(): void {
  isDragging.value = true;
}

function handleDragLeave(): void {
  isDragging.value = false;
}

function handleDrop(event: DragEvent): void {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    const droppedFile = event.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }
}

function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const selectedFile = target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  }
}

function validateAndSetFile(fileToValidate: File): void {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(fileToValidate.type)) {
    errorMessage.value = 'Por favor, selecione um arquivo PDF, JPG ou PNG';
    return;
  }
  
  if (fileToValidate.size > maxSize) {
    errorMessage.value = 'O arquivo deve ter no máximo 5MB';
    return;
  }
  
  file.value = fileToValidate as FileWithSize;
  errorMessage.value = '';
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(): void {
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

async function handleSubmit(): Promise<void> {
  if (!file.value) {
    errorMessage.value = 'Por favor, selecione um arquivo';
    return;
  }

  isUploading.value = true;
  errorMessage.value = '';
  successData.value = null;

  try {
    const api = await useAPI();
    if (!api) return;
    
    const formData = new FormData();
    formData.append('proof', file.value);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.server.post<SuccessResponse>('/api/premium/proof', formData, config);
    successData.value = response.data;
    props.handleGetProofUrl(response.data.url)
  } catch (error) {
    console.error('Erro no upload:', error);
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      errorMessage.value = (axiosError.response.data as { message?: string })?.message || 'Erro ao enviar arquivo';
    } else {
      errorMessage.value = 'Erro inesperado ao enviar arquivo';
    }
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <div class="file-upload-container">
    <form @submit.prevent="handleSubmit" class="upload-form">
      <div 
        class="drop-zone"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{ 'active': isDragging, 'has-file': file }"
      >
        <div class="drop-content">
          <CloudArrowUpIcon class="drop-icon" />
          <p class="drop-text">
            <span v-if="!file">
              <span v-if="!isDragging">Arraste e solte seu comprovante aqui ou</span>
              <span v-else>Solte o arquivo aqui</span>
            </span>
            <span v-else>{{ file.name }}</span>
          </p>
          <button 
            type="button" 
            class="browse-button"
            @click="triggerFileInput"
          >
            Selecione um arquivo
          </button>
          <input
            type="file"
            id="proof"
            ref="fileInput"
            @change="handleFileChange"
            accept=".pdf,.jpg,.jpeg,.png"
            class="file-input"
          />
        </div>
      </div>

      <div class="file-details" v-if="file">
        <div class="file-info">
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <button 
            type="button" 
            class="remove-button"
            @click="removeFile"
          >
            <XMarkIcon class="remove-icon" />
          </button>
        </div>
      </div>

      <button v-if="!successData" type="submit" :disabled="isUploading || !file" class="submit-button">
        <span v-if="!isUploading">Salvar Comprovante</span>
        <span v-else>
          <ArrowPathIcon class="animate-spin h-4 w-4 inline-block mr-2" />
          Enviando...
        </span>
      </button>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successData" class="success-message">
        <p>{{ successData.message }}</p>
        <a :href="successData.url" target="_blank" class="file-link">
          Ver comprovante
        </a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.file-upload-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.drop-zone.active {
  border-color: #3b82f6;
  background-color: #f0f7ff;
}

.drop-zone.has-file {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.drop-icon {
  width: 48px;
  height: 48px;
  color: #94a3b8;
}

.drop-zone.active .drop-icon {
  color: #3b82f6;
}

.drop-zone.has-file .drop-icon {
  color: #10b981;
}

.drop-text {
  color: #64748b;
  font-size: 0.9375rem;
}

.browse-button {
  padding: 8px 16px;
  background-color: #e2e8f0;
  color: #334155;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.browse-button:hover {
  background-color: #cbd5e1;
}

.file-input {
  display: none;
}

.file-details {
  margin-top: -8px;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f1f5f9;
  border-radius: 6px;
}

.file-size {
  font-size: 0.8125rem;
  color: #64748b;
}

.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #64748b;
  transition: all 0.2s ease;
}

.remove-button:hover {
  color: #ef4444;
}

.remove-icon {
  width: 16px;
  height: 16px;
}

.submit-button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  text-align: center;
  font-size: 0.875rem;
}

.success-message {
  padding: 12px;
  background-color: #dcfce7;
  color: #166534;
  border-radius: 6px;
  text-align: center;
  font-size: 0.875rem;
}

.file-link {
  color: #1d4ed8;
  text-decoration: underline;
  margin-top: 8px;
  display: inline-block;
  font-size: 0.875rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .file-upload-container {
    padding: 16px;
  }
  
  .drop-zone {
    padding: 24px;
  }
  
  .drop-icon {
    width: 40px;
    height: 40px;
  }
}
</style>