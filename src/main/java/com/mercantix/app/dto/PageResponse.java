package com.mercantix.app.dto;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/**
 * Generic page envelope — keeps API responses framework-agnostic
 * (clients don't need to parse Spring's PageImpl shape).
 *
 * Use {@link #of(Page, Function)} to map an entity Page to a DTO PageResponse.
 */
public class PageResponse<T> {

    private final List<T> content;
    private final int     page;          // 0-based
    private final int     size;
    private final long    totalElements;
    private final int     totalPages;
    private final boolean first;
    private final boolean last;

    public PageResponse(List<T> content, int page, int size, long totalElements,
                        int totalPages, boolean first, boolean last) {
        this.content       = content;
        this.page          = page;
        this.size          = size;
        this.totalElements = totalElements;
        this.totalPages    = totalPages;
        this.first         = first;
        this.last          = last;
    }

    public static <E, T> PageResponse<T> of(Page<E> source, Function<E, T> mapper) {
        return new PageResponse<>(
                source.getContent().stream().map(mapper).toList(),
                source.getNumber(),
                source.getSize(),
                source.getTotalElements(),
                source.getTotalPages(),
                source.isFirst(),
                source.isLast()
        );
    }

    public List<T> getContent()       { return content; }
    public int     getPage()          { return page; }
    public int     getSize()          { return size; }
    public long    getTotalElements() { return totalElements; }
    public int     getTotalPages()    { return totalPages; }
    public boolean isFirst()          { return first; }
    public boolean isLast()           { return last; }
}
