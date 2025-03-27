import { ref } from "vue";
import { useAPI } from "./useApi";
import { AxiosError } from "axios";
import type { API } from "@/api/config";
import { useTransactionStore } from "@/stores/transactions";
import useCustomToast from "./useCustomToast";

export function useCreateTransaction(wallet_id: string | string[]){
    const {refetchTransactions} = useTransactionStore()
    const {showWarning, showError, showSuccess} = useCustomToast()

    const isCreatingTransaction = ref(false);
    const nameTransaction = ref("");
    const description = ref("");
    const typeTransaction = ref("INCOME");
    const subtypeTransaction = ref("FOOD");
    const amountTransaction = ref("");
    const isRecurring = ref(false);
    const transactionDate = ref(formatDateToRef(new Date()));
    const recurrenceStart = ref(formatDateToRef(new Date()));
    const recurrenceEnd = ref(formatDateToRef(new Date()));
    const proofUrl = ref<string | null>(null)

    function formatDateToRef(date: Date){
        return date.toISOString().split("T")[0];
    }
      
    function formatDateToApi(date: string){
        return date+"T00:00:00.000Z"
    }
      
    async function handleCreateTransaction() {
        if (nameTransaction.value.length < 3 || amountTransaction.value.length < 1) {
            showWarning("Por favor, preencha os campos de nome e valor corretamente!", "Aviso!")
            return
        }
        const api = await useAPI();
        if (!api) {
            return;
        }
    
        if (!isRecurring.value) {
            createSingleTransaction(api)
            return
        }
        createRecurrentTransaction(api)
    }
    
    async function createSingleTransaction(api: typeof API) {
        isCreatingTransaction.value = true
        try {
            const data = {
                name: nameTransaction.value,
                type: typeTransaction.value,
                amount: amountTransaction.value,
                transaction_date: formatDateToApi(transactionDate.value),
                subtype: subtypeTransaction.value,
                description: description.value,
                proof_url: proofUrl.value,
                wallet_id: parseInt(wallet_id as string)
            }
    
            await api.server.post("/api/transaction/single", data)
            refetchTransactions()
            handleResetForm()
            showSuccess("Transação criada com sucesso!", "Sucesso!")
        } catch (error) {
            if (error instanceof AxiosError) {
                showError(error.response?.data.message, "Erro!")
                alert(error.response?.data.message)
            }
            showError("Erro inesperado ao criar transação.", "Erro!")
            alert("Erro inesperado ao criar transação.")
            
        } finally{
            isCreatingTransaction.value = false
        }
    }
    
    async function createRecurrentTransaction(api: typeof API) {
        if (recurrenceEnd < recurrenceStart) {
            alert("Por favor, escolha uma data final maior que a inicial!")
            return
        }
        isCreatingTransaction.value = true
        try {
            const data = {
                name: nameTransaction.value,
                type: typeTransaction.value,
                amount: amountTransaction.value,
                start_date: formatDateToApi(recurrenceStart.value),
                end_date: formatDateToApi(recurrenceEnd.value),
                subtype: subtypeTransaction.value,
                description: description.value,
                proof_url: null,
                wallet_id: parseInt(wallet_id as string),
            };
    
            await api.server.post("/api/transaction/recurrent", data);
            refetchTransactions()
            handleResetForm()
            showSuccess("Transações recorrentes criadas com sucesso!", "Sucesso!")
        } catch (error) {
            if (error instanceof AxiosError) {
                showError(error.response?.data.message, "Erro!")
                return
            }
            showError("Erro inesperado ao criar transações recorrentes.", "Erro!")
            
        } finally{
            isCreatingTransaction.value = false
        }
    }

    function handleGetProofUrl(url: string){
        proofUrl.value = url
    }

    function handleResetForm(){
        isCreatingTransaction.value = (false);
        nameTransaction.value = ("");
        description.value = ("");
        typeTransaction.value = ("INCOME");
        amountTransaction.value = ("");
        isRecurring.value = (false);
        transactionDate.value = formatDateToRef(new Date());
        recurrenceStart.value = formatDateToRef(new Date());
        recurrenceEnd.value = formatDateToRef(new Date());
        proofUrl.value = (null)
    }

    return {
        handleGetProofUrl,
        handleCreateTransaction,
        nameTransaction,
        description,
        typeTransaction,
        subtypeTransaction,
        amountTransaction,
        isRecurring,
        transactionDate,
        recurrenceStart,
        recurrenceEnd,
        isCreatingTransaction
    }
}