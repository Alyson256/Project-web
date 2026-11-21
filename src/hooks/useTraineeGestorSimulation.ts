import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../contexts';

export interface TraineeTask {
  id: number;
  title: string;
  isDone: boolean;
  doneDate?: string;
}

export interface UseTraineeGestorSimulationParams {
  onTaskCompleted?: (taskTitle: string) => void;
}

export function useTraineeGestorSimulation({ onTaskCompleted }: UseTraineeGestorSimulationParams) {
  const { addToast } = useToast();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const [tasks, setTasks] = useState<TraineeTask[]>([
    { id: 1, title: 'Editar um texto (rascunho)', isDone: true, doneDate: 'Ontem às 14:20' },
    { id: 2, title: 'Enviar uma foto', isDone: true, doneDate: 'Ontem às 15:10' },
    { id: 3, title: 'Colar um link de vídeo', isDone: false },
    { id: 4, title: 'Aprovar uma peça de exemplo', isDone: false },
  ]);

  const [sampleText, setSampleText] = useState(
    'O Ateliê Potengi reúne mestres do barro, argila e renda de bilro no Rio Grande do Norte.'
  );
  const [sampleVideoUrl, setSampleVideoUrl] = useState('');
  const [samplePhotoTitle, setSamplePhotoTitle] = useState('');
  const [samplePieceApproved, setSamplePieceApproved] = useState(false);

  const completedCount = tasks.filter((t) => t.isDone).length;
  const isAllDone = completedCount === 4;
  const prevAllDoneRef = useRef(isAllDone);

  useEffect(() => {
    if (isAllDone && !prevAllDoneRef.current) {
      setShowCompletionModal(true);
    }
    prevAllDoneRef.current = isAllDone;
  }, [isAllDone]);

  const closeCompletionModal = useCallback(() => setShowCompletionModal(false), []);

  const markTaskDone = useCallback(
    (id: number) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id && !task.isDone) {
            if (onTaskCompleted) onTaskCompleted(task.title);
            return { ...task, isDone: true, doneDate: 'Agora' };
          }
          return task;
        })
      );
    },
    [onTaskCompleted]
  );

  const handleSaveTextSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    markTaskDone(1);
    addToast('Rascunho de texto salvo com sucesso! Nada foi para o site público.', 'success');
  };

  const handleSavePhotoSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!samplePhotoTitle.trim()) {
      addToast('Escreva um título de exemplo para a foto.', 'error');
      return;
    }
    markTaskDone(2);
    setSamplePhotoTitle('');
    addToast('Foto de simulação enviada com sucesso! Nada foi para o site público.', 'success');
  };

  const handleSaveVideoSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleVideoUrl.trim()) {
      addToast('Cole um link de exemplo de vídeo.', 'error');
      return;
    }
    markTaskDone(3);
    setSampleVideoUrl('');
    addToast('Link de vídeo de simulação salvo com sucesso! Nada foi para o site público.', 'success');
  };

  const handleApprovePieceSimulation = () => {
    setSamplePieceApproved(true);
    markTaskDone(4);
    addToast('Peça aprovada na simulação! Nada foi para o site.', 'success');
  };

  return {
    tasks,
    completedCount,
    isAllDone,
    showCompletionModal,
    closeCompletionModal,
    sampleText,
    setSampleText,
    sampleVideoUrl,
    setSampleVideoUrl,
    samplePhotoTitle,
    setSamplePhotoTitle,
    samplePieceApproved,
    handleSaveTextSimulation,
    handleSavePhotoSimulation,
    handleSaveVideoSimulation,
    handleApprovePieceSimulation,
  };
}
